const { Order, Program, sequelize } = require('../models');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary dari Environment Variables Vercel / .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper untuk mengekstrak public_id Cloudinary dari URL gambar
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    // Contoh URL: https://res.cloudinary.com/rcroqsd5/image/upload/v12345/byfest_bukti_tf/filename.jpg
    const parts = url.split('/');
    const filename = parts.pop().split('.')[0]; // nama file tanpa ekstensi
    const folder = parts.pop(); // byfest_bukti_tf
    return `${folder}/${filename}`;
  } catch (err) {
    return null;
  }
};

// Helper untuk menghapus file dari Cloudinary jika transaksi gagal / dibatalkan
const removeCloudinaryFile = async (req) => {
  if (req.file && req.file.path) {
    const publicId = getPublicIdFromUrl(req.file.path);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch((err) => {
        console.error('Gagal menghapus file rollback di Cloudinary:', err.message);
      });
    }
  }
};

// 1. User: Checkout (dengan Pengurangan Kuota Program & Upload ke Cloudinary)
const createOrder = async (req, res) => {
  // Mulai Database Transaction
  const t = await sequelize.transaction();

  try {
    const { buyer_name, phone, email, items, total_amount } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bukti pembayaran wajib diunggah!' 
      });
    }

    // Parse items jika dikirim dalam bentuk string JSON dari frontend / Thunder Client
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ 
        success: false, 
        message: 'Item tiket tidak valid atau kosong.' 
      });
    }

    // A. VALIDASI & POTONG KUOTA PROGRAM (JIKA ID NUMERIK)
    for (const item of parsedItems) {
      const numericId = parseInt(item.id, 10);
      const isNumeric = !isNaN(numericId) && /^\d+$/.test(String(item.id).trim());

      if (isNumeric) {
        const program = await Program.findByPk(numericId, { transaction: t });

        if (program) {
          // Cek ketersediaan kuota jika program memiliki batas kuota
          if (program.quota !== null && program.quota !== undefined && program.quota < item.qty) {
            await t.rollback();
            await removeCloudinaryFile(req);
            return res.status(400).json({
              success: false,
              message: `Kuota untuk program "${program.title || program.name}" tidak mencukupi (Sisa: ${program.quota}).`
            });
          }

          // Kurangi kuota program
          if (program.quota !== null && program.quota !== undefined) {
            await program.decrement('quota', {
              by: item.qty,
              transaction: t
            });
          }
        }
      }
    }

    // Hitung total_amount dengan aman (mencegah NaN pada database)
    let finalTotal = 0;
    if (total_amount !== undefined && total_amount !== null && !isNaN(Number(total_amount))) {
      finalTotal = Math.round(Number(total_amount));
    } else {
      for (const item of parsedItems) {
        const p = Number(item.price) || 0;
        const q = Number(item.qty) || 1;
        finalTotal += p * q;
      }
    }

    // B. BUAT KODE ORDER & SIMPAN KE DATABASE
    const orderCode = `BYF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // req.file.path otomatis berisi URL HTTPS publik resmi dari Cloudinary
    const paymentProofUrl = req.file.path;

    const newOrder = await Order.create({
      order_code: orderCode,
      buyer_name,
      phone,
      email,
      tickets_summary: typeof items === 'string' ? items : JSON.stringify(items),
      total_amount: finalTotal,
      payment_proof: paymentProofUrl, // Menyimpan URL Cloudinary
      status: 'pending'
    }, { transaction: t });

    // Commit seluruh transaksi jika berhasil
    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Pemesanan berhasil dibuat!',
      data: {
        order_code: newOrder.order_code,
        status: newOrder.status,
        payment_proof: newOrder.payment_proof,
        total_amount: newOrder.total_amount
      }
    });

  } catch (error) {
    // Batalkan seluruh transaksi database & hapus file yang terunggah di Cloudinary
    await t.rollback();
    await removeCloudinaryFile(req);

    console.error('Error createOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memproses pesanan.',
      error: error.message
    });
  }
};

// 2. Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['created_at', 'DESC']] });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
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
      const publicId = getPublicIdFromUrl(order.payment_proof);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error('Gagal menghapus file dari Cloudinary:', err.message);
        });
      }
    }

    // Hapus data order dari database PostgreSQL
    await order.destroy();
    return res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleteOrder:', error);
    return res.status(500).json({ success: false, message: 'Gagal menghapus pesanan.' });
  }
};

// 5. Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (status) {
      order.status = status;
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: `Status pesanan #${id} berhasil diubah menjadi ${status}.`,
      data: order
    });
  } catch (error) {
    console.error('Error updateOrderStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status pesanan.',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
};
