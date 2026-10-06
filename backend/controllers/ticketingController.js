const crypto = require('crypto');
const { Order, Program, sequelize } = require('../models');
const cloudinary = require('../config/cloudinary');
const { TICKETS, MAX_QTY_PER_ITEM } = require('../config/tickets');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?\d{9,15}$/;

// Detail error baru dikirim ke client kalau EXPOSE_ERRORS=true (untuk debugging saja)
const errorDetail = (error) =>
  process.env.EXPOSE_ERRORS === 'true' ? { detail: error.message } : {};

// Helper: ekstrak public_id & resource_type Cloudinary dari URL
// https://res.cloudinary.com/xxx/image/upload/v123/byfest_bukti_tf/file.jpg
//   -> { publicId: 'byfest_bukti_tf/file', resourceType: 'image' }
const parseCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const match = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;

    const resourceType = match[1];
    let publicId = decodeURIComponent(match[2].split('?')[0]);

    // image/video: public_id tanpa ekstensi. raw: ekstensi ikut.
    if (resourceType !== 'raw') {
      publicId = publicId.replace(/\.[^./]+$/, '');
    }
    return { publicId, resourceType };
  } catch (err) {
    return null;
  }
};

const destroyByUrl = async (url) => {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return;
  try {
    await cloudinary.uploader.destroy(parsed.publicId, {
      resource_type: parsed.resourceType,
    });
  } catch (err) {
    console.error('Gagal menghapus file di Cloudinary:', err.message);
  }
};

const removeCloudinaryFile = async (req) => {
  if (req.file && req.file.path) {
    await destroyByUrl(req.file.path);
  }
};

// Rollback aman (tidak error kalau transaksi null / sudah selesai)
const safeRollback = async (t) => {
  if (t && !t.finished) {
    try {
      await t.rollback();
    } catch (err) {
      console.error('Gagal rollback transaksi:', err.message);
    }
  }
};

// Kirim error validasi: rollback + hapus file + balas JSON
const failWith = async (req, res, t, status, message) => {
  await safeRollback(t);
  await removeCloudinaryFile(req);
  return res.status(status).json({ success: false, message });
};

// 1. User: Checkout
const createOrder = async (req, res) => {
  let t = null;

  try {
    const body = req.body || {};

    // ---------- Validasi input (sebelum membuka transaksi) ----------
    if (!req.file) {
      return failWith(req, res, null, 400, 'Bukti pembayaran wajib diunggah!');
    }

    const buyer_name = String(body.buyer_name || '').trim();
    const phone = String(body.phone || '').replace(/[\s\-()]/g, '');
    const email = String(body.email || '').trim().toLowerCase();

    if (!buyer_name || !phone || !email) {
      return failWith(req, res, null, 400, 'Nama, nomor telepon, dan email wajib diisi.');
    }
    if (buyer_name.length > 100 || email.length > 100) {
      return failWith(req, res, null, 400, 'Nama atau email terlalu panjang.');
    }
    if (!PHONE_RE.test(phone)) {
      return failWith(req, res, null, 400, 'Nomor telepon tidak valid.');
    }
    if (!EMAIL_RE.test(email)) {
      return failWith(req, res, null, 400, 'Format email tidak valid.');
    }

    let parsedItems;
    try {
      parsedItems = typeof body.items === 'string' ? JSON.parse(body.items) : body.items;
    } catch (parseErr) {
      return failWith(req, res, null, 400, 'Format item tiket tidak valid.');
    }
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return failWith(req, res, null, 400, 'Item tiket tidak valid atau kosong.');
    }

    // Gabungkan id ganda & validasi terhadap daftar tiket di server.
    // Hanya id & qty dari client yang dipakai; harga/nama/total dari client diabaikan.
    const merged = new Map();
    for (const item of parsedItems) {
      const id = String(item && item.id);
      const qty = Number(item && item.qty);
      if (!TICKETS.has(id)) {
        return failWith(req, res, null, 400, 'Ada tiket yang tidak dikenali.');
      }
      if (!Number.isInteger(qty) || qty <= 0) {
        return failWith(req, res, null, 400, `Jumlah tiket "${TICKETS.get(id).name}" tidak valid.`);
      }
      merged.set(id, (merged.get(id) || 0) + qty);
    }
    for (const [id, qty] of merged) {
      if (qty > MAX_QTY_PER_ITEM) {
        return failWith(
          req, res, null, 400,
          `Maksimal ${MAX_QTY_PER_ITEM} tiket per jenis ("${TICKETS.get(id).name}").`
        );
      }
    }

    // ---------- Transaksi: potong kuota + simpan order ----------
    t = await sequelize.transaction();

    let total = 0;
    const summary = [];

    // Diurutkan supaya order paralel mengunci baris dengan urutan sama (hindari deadlock)
    const entries = [...merged].sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    for (const [id, qty] of entries) {
      const ticket = TICKETS.get(id);

      if (ticket.programId) {
        const program = await Program.findByPk(ticket.programId, {
          transaction: t,
          lock: t.LOCK.UPDATE, // kunci baris agar kuota tidak balapan
        });

        if (!program) {
          return failWith(req, res, t, 404, `Program untuk "${ticket.name}" tidak ditemukan.`);
        }
        if (program.quota < qty) {
          return failWith(
            req, res, t, 400,
            `Kuota untuk "${ticket.name}" tidak mencukupi (Sisa: ${program.quota}).`
          );
        }
        await program.decrement('quota', { by: qty, transaction: t });
      }

      total += ticket.price * qty;
      summary.push({ id, name: ticket.name, unit_price: ticket.price, qty });
    }

    const orderCode = `BYF-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;

    const newOrder = await Order.create(
      {
        order_code: orderCode,
        buyer_name,
        phone,
        email,
        tickets_summary: JSON.stringify(summary),
        total_amount: total,
        payment_proof: req.file.path, // URL HTTPS publik dari Cloudinary
        status: 'pending',
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Pemesanan berhasil dibuat!',
      data: {
        order_code: newOrder.order_code,
        status: newOrder.status,
        total_amount: newOrder.total_amount,
        payment_proof: newOrder.payment_proof,
      },
    });
  } catch (error) {
    await safeRollback(t);
    await removeCloudinaryFile(req);

    console.error('Error createOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses pesanan.',
      ...errorDetail(error),
    });
  }
};

// 2. Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['created_at', 'DESC']] });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error getAllOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pesanan.',
      ...errorDetail(error),
    });
  }
};

// 3. Admin: Get Order By ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error getOrderById:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail pesanan.',
      ...errorDetail(error),
    });
  }
};

// 4. Admin: Delete Order (hapus order, kembalikan kuota, hapus bukti di Cloudinary)
const deleteOrder = async (req, res) => {
  let t = null;
  try {
    t = await sequelize.transaction();

    const order = await Order.findByPk(req.params.id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!order) {
      await safeRollback(t);
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    // Order yang masih memegang kuota (pending/paid) mengembalikan kuotanya
    if (['pending', 'paid'].includes(order.status)) {
      let items = [];
      try {
        items = JSON.parse(order.tickets_summary);
      } catch (e) {
        items = [];
      }
      for (const item of Array.isArray(items) ? items : []) {
        const ticket = TICKETS.get(String(item.id));
        const qty = Number(item.qty);
        if (ticket && ticket.programId && Number.isInteger(qty) && qty > 0) {
          await Program.increment('quota', {
            by: qty,
            where: { id: ticket.programId },
            transaction: t,
          });
        }
      }
    }

    const proofUrl = order.payment_proof;
    await order.destroy({ transaction: t });
    await t.commit();

    // Hapus file setelah DB berhasil; kalau gagal, cukup tercatat di log
    if (proofUrl) await destroyByUrl(proofUrl);

    return res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (error) {
    await safeRollback(t);
    console.error('Error deleteOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesanan.',
      ...errorDetail(error),
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
