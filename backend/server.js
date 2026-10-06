require('pg'); // Memaksa bundler Vercel mendeteksi library pg
const express = require('express');
const cors = require('cors');

// Impor connectDB dari config/db.js
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

// 3. Rute Test Utama (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'BYFEST Backend API is running successfully on Vercel!' 
  });
});

// 4. Import dan Registrasi Routes
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/ticketing', require('./routes/ticketingRoutes'));
app.use('/api/venue', require('./routes/venueRoutes'));
app.use('/api/films', require('./routes/filmRoutes'));

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// 6. Jalankan app.listen Hanya di Lingkungan Lokal
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// 7. Ekspor Modul Express untuk Vercel Serverless Function
module.exports = app;
