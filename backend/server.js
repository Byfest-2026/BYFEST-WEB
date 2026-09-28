const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Inisialisasi Koneksi Database (Non-blocking untuk Vercel Serverless)
connectDB().catch((err) => {
  console.error('Database connection error during startup:', err.message);
});

// 3. Penanganan Folder Uploads Secara Aman di Vercel (Read-Only Filesystem)
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    // Pada lingkungan Vercel, pembuatan direktori lokal /uploads bisa dibatasi.
    // Membungkusnya dengan try-catch mencegah serverless function crash saat cold start.
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('Sistem file lokal bersifat read-only (Vercel Runtime environment).');
}

// Melayani file statis folder uploads
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// 4. Rute Test Utama (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'BYFEST Backend API is running successfully on Vercel!' 
  });
});

// 5. Import dan Registrasi Routes
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/ticketing', require('./routes/ticketingRoutes'));
app.use('/api/venue', require('./routes/venueRoutes'));
app.use('/api/films', require('./routes/filmRoutes'));

// 6. Global Error Handler (Pencegah Crash 500 Tanpa Respon)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// 7. Jalankan app.listen Hanya di Lingkungan Lokal
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// 8. Ekspor Modul Express untuk Vercel Serverless Function
module.exports = app;