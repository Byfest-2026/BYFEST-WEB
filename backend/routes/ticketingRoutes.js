const express = require('express');
const router = express.Router();
const uploadPayment = require('../middleware/upload');
const { 
  createOrder, 
  getAllOrders, 
  getOrderById, 
  deleteOrder 
} = require('../controllers/ticketingController');

// ==========================================
// 1. ROUTE USER (POST /api/ticketing/checkout)
// ==========================================
router.post('/checkout', uploadPayment.single('payment_proof'), createOrder);

// ==========================================
// 2. ROUTE ADMIN
// ==========================================
// Menampilkan semua daftar pesanan pembeli
router.get('/admin/orders', getAllOrders);

// Menampilkan detail 1 pesanan berdasarkan ID
router.get('/admin/orders/:id', getOrderById);

// Menghapus pesanan beserta file gambar bukti bayar
router.delete('/admin/orders/:id', deleteOrder);

module.exports = router;