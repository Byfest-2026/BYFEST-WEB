const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
dotenv.config();

// Import Database
const { connectDB } = require('./config/db');

// Inisialisasi Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handling Folder Uploads secara Aman di Vercel
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }));
}

// Rute Utama (Root Endpoint)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'BYFEST Backend API is running on Vercel!' 
  });
});

// Import Routes API dengan Try-Catch agar Server Tidak Crash Total
try {
  app.use('/api/home', require('./routes/homeRoutes'));
  app.use('/api/programs', require('./routes/programRoutes'));
  app.use('/api/about', require('./routes/aboutRoutes'));
  app.use('/api/ticketing', require('./routes/ticketingRoutes'));
  app.use('/api/venue', require('./routes/venueRoutes'));
  app.use('/api/films', require('./routes/filmRoutes'));
} catch (err) {
  console.error('Error loading routes:', err.message);
}

// Ekspor Modul untuk Vercel Serverless Function (WAJIB)
module.exports = app;

// Jalankan app.listen Hanya di Lokal
if (process.env.NODE_ENV !== 'production') {
  const startApp = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Gagal menjalankan server lokal:', error.message);
    }
  };
  startApp();
}