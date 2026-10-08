const express = require('express');
const router = express.Router();

const { uploadPayment } = require('../middleware/upload');

const {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrderStatus
} = require('../controllers/ticketingController');

// ==========================================
// 1. ROUTE USER (POST /api/ticketing/checkout)
// ==========================================
router.post('/checkout', uploadPayment.single('payment_proof'), createOrder);

// ==========================================
// 2. ROUTE ADMIN & ORDERS MANAGEMENT
// ==========================================
// Menampilkan semua daftar pesanan pembeli (mendukung /orders & /admin/orders)
router.get('/orders', getAllOrders);
router.get('/admin/orders', getAllOrders);

// Menampilkan detail 1 pesanan berdasarkan ID
router.get('/orders/:id', getOrderById);
router.get('/admin/orders/:id', getOrderById);

// Update status pesanan (PUT /order/:id/status & /admin/orders/:id/status)
router.put('/order/:id/status', updateOrderStatus);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/admin/orders/:id/status', updateOrderStatus);

// Menghapus pesanan beserta file gambar bukti bayar
router.delete('/orders/:id', deleteOrder);
router.delete('/admin/orders/:id', deleteOrder);

module.exports = router;
