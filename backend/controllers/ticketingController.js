const { Order, Program, sequelize } = require('../models');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary dari Environment Variables Vercel / .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: ekstrak public_id & resource_type Cloudinary dari URL
// Contoh: https://res.cloudinary.com/xxx/image/upload/v123/byfest_bukti_tf/file.jpg
//   -> { publicId: 'byfest_bukti_tf/file', resourceType: 'image' }
const parseCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const match = url.match(/\/(image|raw|video)\/upload\/(?:v\d+\/)?(.+)$/);
    if (!match) return null;

    const resourceType = match[1];
    let publicId = match[2].split('?')[0];

    // Untuk image/video, public_id tanpa ekstensi. Untuk raw, ekstensi ikut.
    if (resourceType !== 'raw') {
      publicId = publicId.replace(/\.[^./]+$/, '');
    }

    return { publicId, resourceType };
  } catch (err) {
    return null;
  }
};

// Helper: hapus file di Cloudinary berdasarkan URL
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

// Helper: hapus file upload dari request (dipakai saat transaksi gagal / dibatalkan)
const removeCloudinaryFile = async (req) => {
  if (req.file && req.file.path) {
    await destroyByUrl(req.file.path);
  }
};

// Helper: rollback aman (tidak error kalau transaksi sudah selesai)
const safeRollback = async (t) => {
  if (t && !t.finished) {
    try {
      await t.rollback();
    } catch (err) {
      console.error('Gagal rollback transaksi:', err.message);
    }
  }
};

// Helper: kirim error validasi (rollback + hapus file + balas JSON)
const failWith = async (req, res, t, status, message) => {
  await safeRollback(t);
  await removeCloudinaryFile(req);
  return res.status(status).json({ success: false, message });
};

// 1. User: Checkout (dengan Pengurangan Kuota Program & Upload ke Cloudinary)
const createOrder = async (req, res) => {
  // Mulai Database Transaction
  const t = await sequelize.transaction();

  try {
    const { buyer_name, phone, email, items, total_amount } = req.body;

    if (!req.file) {
      return failWith(req, res, t, 400, 'Bukti pembayaran wajib diunggah!');
    }

    if (!buyer_name || !phone || !email) {
      return failWith(req, res, t, 400, 'Nama, nomor telepon, dan email wajib diisi.');
    }

    // Parse items jika dikirim sebagai string JSON dari frontend / Thunder Client
    let parsedItems;
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch (parseErr) {
      return failWith(req, res, t, 400, 'Format item tiket tidak valid.');
    }

    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      return failWith(req, res, t, 400, 'Item tiket tidak valid atau kosong.');
    }

    // A. VALIDASI & POTONG KUOTA PROGRAM
    for (const item of parsedItems) {
      const qty = Number(item.qty);

      if (!Number.isInteger(qty) || qty <= 0) {
        return failWith(req, res, t, 400, `Jumlah tiket untuk "${item.name || item.id}" tidak valid.`);
      }

      // Tiket pass (mis. "all-day") bukan program, jadi tidak memotong kuota
      if (!/^\d+$/.test(String(item.id))) continue;

      const programId = parseInt(item.id, 10);

      const program = await Program.findByPk(programId, {
        transaction: t,
        lock: t.LOCK.UPDATE, // kunci baris agar kuota tidak balapan antar pembeli
      });

      if (!program) {
        return failWith(req, res, t, 404, `Program dengan ID ${programId} tidak ditemukan.`);
      }

      // Cek ketersediaan kuota
      if (program.quota < qty) {
        return failWith(
          req,
          res,
          t,
          400,
          `Kuota untuk program "${program.name}" tidak mencukupi (Sisa: ${program.quota}).`
        );
      }

      // Kurangi kuota program
      await program.decrement('quota', {
        by: qty,
        transaction: t,
      });
    }

    // B. BUAT KODE ORDER & SIMPAN KE DATABASE
    const orderCode = `BYF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // req.file.path berisi URL HTTPS publik dari Cloudinary
    const paymentProofUrl = req.file.path;

    const newOrder = await Order.create(
      {
        order_code: orderCode,
        buyer_name,
        phone,
        email,
        tickets_summary: JSON.stringify(parsedItems),
        total_amount: Number(total_amount) || 0,
        payment_proof: paymentProofUrl,
        status: 'pending',
      },
      { transaction: t }
    );

    // Commit seluruh transaksi jika berhasil
    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Pemesanan berhasil dibuat!',
      data: {
        order_code: newOrder.order_code,
        status: newOrder.status,
        payment_proof: newOrder.payment_proof,
      },
    });
  } catch (error) {
    // Batalkan transaksi database & hapus file yang terunggah di Cloudinary
    await safeRollback(t);
    await removeCloudinaryFile(req);

    console.error('Error createOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses pesanan.',
      error: error.message,
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
    return res.status(500).json({ success: false, message: 'Gagal mengambil data pesanan.' });
  }
};

// 3. Admin: Get Order By ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error getOrderById:', error);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail pesanan.' });
  }
};

// 4. Admin: Delete Order (Menghapus Order & Foto di Cloudinary)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    // Jika pesanan memiliki bukti pembayaran, hapus filenya dari Cloudinary
    if (order.payment_proof) {
      await destroyByUrl(order.payment_proof);
    }

    // Hapus data order dari database PostgreSQL
    await order.destroy();
    return res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleteOrder:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus pesanan.' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
