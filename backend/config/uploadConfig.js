const multer = require('multer');
const path = require('path');

// Pengaturan penyimpanan file bukti transfer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/proofs/'); // Pastikan folder ini sudah dibuat
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'proof-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

module.exports = upload;