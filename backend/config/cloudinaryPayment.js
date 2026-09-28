const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Memuat konfigurasi kredensial Cloudinary dari .env / Vercel Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Mengatur folder penyimpanan khusus bukti transfer transaksi tiket
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'byfest_bukti_tf', // Nama folder terpisah di dashboard Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
  },
});

const uploadPaymentProof = multer({ storage: paymentStorage });

module.exports = uploadPaymentProof;