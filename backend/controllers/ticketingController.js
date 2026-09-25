const { Order, Program, sequelize } = require('../models'); // Import Program & sequelize instance
const fs = require('fs');
const path = require('path');

// Helper untuk menghapus file jika terjadi kegagalan
const removeUploadedFile = (req) => {
  if (req.file) {
    const filePath = path.join(__dirname, '../..', req.file.path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

// 1. User: Checkout (dengan Pengurangan Kuota Program)
const createOrder = async (req, res) => {
  // Mulai Database Transaction
  const t = await sequelize.transaction();

  try {
    const { buyer_name, phone, email, items, total_amount } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Bukti pembayaran wajib diunggah!' });
    }

    // Parse items jika dikirim dalam bentuk string JSON dari frontend
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;

    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      removeUploadedFile(req);
      return res.status(400).json({ success: false, message: 'Item tiket tidak valid atau kosong.' });
    }

    // A. VALIDASI & POTONG KUOTA PROGRAM
    for (const item of parsedItems) {
      // Cari program berdasarkan ID
      const program = await Program.findByPk(item.id, { transaction: t });

      if (!program) {
        await t.rollback();
        removeUploadedFile(req);
        return res.status(404).json({
          success: false,
          message: `Program dengan ID ${item.id} tidak ditemukan.`
        });
      }

      // Cek ketersediaan kuota
      if (program.quota < item.qty) {
        await t.rollback();
        removeUploadedFile(req);
        return res.status(400).json({
          success: false,
          message: `Kuota untuk program "${program.title || program.name}" tidak mencukupi (Sisa: ${program.quota}).`
        });
      }

      // Kurangi kuota program
      await program.decrement('quota', {
        by: item.qty,
        transaction: t
      });
    }

    // B. BUAT KODE ORDER & SIMPAN KE DATABASE
    const orderCode = `BYF-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      order_code: orderCode,
      buyer_name,
      phone,
      email,
      tickets_summary: typeof items === 'string' ? items : JSON.stringify(items),
      total_amount: Number(total_amount),
      payment_proof: `/uploads/payments/${req.file.filename}`,
      status: 'pending'
    }, { transaction: t });

    // Commit seluruh transaksi jika berhasil
    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Pemesanan berhasil dibuat!',
      data: {
        order_code: newOrder.order_code,
        status: newOrder.status
      }
    });

  } catch (error) {
    // Batalkan seluruh transaksi database & hapus file upload
    await t.rollback();
    removeUploadedFile(req);

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

// 4. Admin: Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Pesanan tidak ditemukan.' });
    }

    if (order.payment_proof) {
      const filePath = path.join(__dirname, '../..', order.payment_proof);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await order.destroy();
    return res.status(200).json({ success: true, message: 'Pesanan berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Gagal menghapus pesanan.' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder
};