const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
dotenv.config();

// Import Database & Models
const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

// Import Routes API
const homeRoutes = require('./routes/homeRoutes');
const programRoutes = require('./routes/programRoutes');
const aboutRoutes = require('./routes/aboutRoutes');
const ticketingRoutes = require('./routes/ticketingRoutes');
const venueRoutes = require('./routes/venueRoutes');
const filmRoutes = require('./routes/filmRoutes');

// 1. Inisialisasi Express App
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Akses Folder Upload Gambar Statis (Bukti Transfer, Poster, Avatar, dll)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// 4. Registrasi Endpoint API
app.use('/api/home', homeRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/ticketing', ticketingRoutes);
app.use('/api/venue', venueRoutes);
app.use('/api/films', filmRoutes);

app.get('/', (req, res) => {
  res.send('Server BYFEST backend berjalan!');
});

// 5. Fungsi Jalankan Aplikasi & Sinkronisasi DB
const startApp = async () => {
  try {
    // Tes DB & Sinkronisasi Tabel
    await connectDB();
    await sequelize.sync();
    console.log('Database & seluruh tabel berhasil disinkronkan!');

    // Jalankan Server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error.message);
  }
};

startApp();