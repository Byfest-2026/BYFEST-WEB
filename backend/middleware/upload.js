const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Konfigurasi kredensial Cloudinary dari Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 1. Storage Umum (Gallery, Leads, Posters, Awards)
const generalStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'byfest_media', // Folder umum di Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// 2. Storage Khusus Bukti Transfer Pembayaran
const paymentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'byfest_bukti_tf',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
  },
});

// Instance Multer
const upload = multer({ storage: generalStorage });
const uploadPayment = multer({ storage: paymentStorage });

// Eksport default sebagai 'upload' dan eksport opsional 'uploadPayment'
module.exports = upload;
module.exports.uploadPayment = uploadPayment;