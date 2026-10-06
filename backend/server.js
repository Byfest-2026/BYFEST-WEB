require('pg'); // Memaksa bundler Vercel mendeteksi library pg
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Di belakang proxy Vercel (perlu kalau nanti pakai rate limit)
app.set('trust proxy', 1);

// Detail error baru dikirim ke client kalau EXPOSE_ERRORS=true (debugging saja)
const exposeErrors = () => process.env.EXPOSE_ERRORS === 'true';

// 1. CORS
// Isi FRONTEND_URL di Vercel (backend) dengan domain frontend, pisahkan dengan koma.
// Contoh: https://byfest-frontend-phi.vercel.app
// Kalau FRONTEND_URL kosong, semua origin diizinkan (supaya tidak memblokir saat setup).
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(null, false);
    },
  })
);

// 2. Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Koneksi DB: dibuat sekali per instance, dicoba ulang kalau gagal.
// Request menunggu koneksi siap, jadi tidak ada query yang jalan sebelum DB tersambung.
let dbReady = null;
const ensureDB = () => {
  if (!dbReady) {
    dbReady = Promise.resolve(connectDB()).catch((err) => {
      dbReady = null; // izinkan retry di request berikutnya
      throw err;
    });
  }
  return dbReady;
};

// 4. Health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BYFEST Backend API is running successfully on Vercel!',
  });
});

// Buka https://<backend>/api/health untuk cek DB & environment variable
app.get('/api/health', async (req, res) => {
  const env = {
    DB_URL_SET: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DB_HOST),
    CLOUDINARY_SET: Boolean(
      process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    ),
    FRONTEND_URL_SET: allowedOrigins.length > 0,
  };
  try {
    await ensureDB();
    res.status(200).json({ status: 'success', db: 'connected', env });
  } catch (err) {
    console.error('Health check: DB gagal:', err);
    res.status(503).json({
      status: 'error',
      db: 'failed',
      env,
      ...(exposeErrors() ? { detail: err.message } : {}),
    });
  }
});

// 5. Semua route /api menunggu DB siap
app.use('/api', async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    console.error('DB connection failed:', err);
    res.status(503).json({
      success: false,
      status: 'error',
      message: 'Layanan sementara tidak tersedia. Coba lagi sebentar.',
      ...(exposeErrors() ? { detail: err.message } : {}),
    });
  }
});

// 6. Routes
app.use('/api/home', require('./routes/homeRoutes'));
app.use('/api/programs', require('./routes/programRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/ticketing', require('./routes/ticketingRoutes'));
app.use('/api/venue', require('./routes/venueRoutes'));
app.use('/api/films', require('./routes/filmRoutes'));

// 7. 404 (JSON, bukan halaman HTML)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 'error',
    message: 'Endpoint tidak ditemukan.',
  });
});

// 8. Global Error Handler (error multer & upload masuk ke sini)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Ukuran file maksimal 4 MB.'
        : 'File tidak valid. Gunakan JPG, PNG, WebP, atau PDF.';
    return res.status(400).json({ success: false, status: 'error', message });
  }

  // Error 4xx yang sengaja dibuat (fileFilter, JSON body rusak, dsb.)
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({
      success: false,
      status: 'error',
      message: err.message,
    });
  }

  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Terjadi kesalahan pada server.',
    ...(exposeErrors() ? { detail: err.message } : {}),
  });
});

// 9. app.listen hanya di lingkungan lokal
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// 10. Ekspor Express app untuk Vercel Serverless Function
module.exports = app;
