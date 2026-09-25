const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { connectDB } = require('./config/db'); // Panggil koneksi DB di atas

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Buka koneksi Database di Vercel Serverless
connectDB().catch((err) => console.error('DB Connection Error:', err));

// Handling Folder Uploads secara Aman
const uploadsDir = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    }
  }));
}

// Rute Test Utama (Cek Health Server)
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'BYFEST Backend API is running successfully on Vercel!' 
  });
});

// Import Routes Langsung Tanpa Try-Catch (Agar jika error terlihat jelas di Vercel Logs)
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/ticketing', require('./routes/ticketingRoutes'));
app.use('/api/venue', require('./routes/venueRoutes'));
app.use('/api/films', require('./routes/filmRoutes'));

// Ekspor Modul Express untuk Vercel Serverless Function
module.exports = app;

// Jalankan app.listen hanya untuk Local Machine
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}