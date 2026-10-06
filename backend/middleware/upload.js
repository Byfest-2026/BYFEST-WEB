const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Batas body Vercel Serverless ~4.5MB, jadi file dibatasi 4MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

// Filter tipe file di sisi multer (sebelum file dikirim ke Cloudinary)
const makeFileFilter = (mimes, exts, message) => (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  if (mimes.includes(file.mimetype) && exts.includes(ext)) {
    return cb(null, true);
  }
  const err = new Error(message);
  err.status = 400; // ditangkap error handler di server.js -> balasan 400
  return cb(err);
};

// 1. Storage Umum (Gallery, Leads, Posters, Awards)
const generalStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'byfest_media',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// 2. Storage Khusus Bukti Transfer Pembayaran
const paymentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'byfest_bukti_tf',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'pdf'],
    resource_type: 'auto', // gambar & PDF sama-sama bisa
  },
});

const upload = multer({
  storage: generalStorage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: makeFileFilter(
    ['image/jpeg', 'image/png', 'image/webp'],
    ['.jpg', '.jpeg', '.png', '.webp'],
    'Format file harus JPG, PNG, atau WebP.'
  ),
});

const uploadPayment = multer({
  storage: paymentStorage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: makeFileFilter(
    ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
    'Format file harus JPG, PNG, WebP, atau PDF.'
  ),
});

// Bentuk ekspor tetap sama seperti sebelumnya (route lain tidak perlu diubah)
module.exports = upload;
module.exports.uploadPayment = uploadPayment;
