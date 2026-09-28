const { Film } = require('../models');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary dari Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper untuk mengekstrak public_id Cloudinary dari URL poster
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const filename = parts.pop().split('.')[0];
    const folder = parts.pop();
    return `\({folder}/\){filename}`;
  } catch (err) {
    return null;
  }
};

// Helper untuk menghapus file dari Cloudinary jika terjadi eror saat pembuatan data
const removeCloudinaryFile = async (req) => {
  if (req.file && req.file.path) {
    const publicId = getPublicIdFromUrl(req.file.path);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch((err) => {
        console.error('Gagal menghapus file rollback Cloudinary:', err.message);
      });
    }
  }
};

// 1. Ambil Semua Data Film (GET)
const getAllFilms = async (req, res) => {
  try {
    const films = await Film.findAll();
    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil seluruh data film',
      data: films
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data film',
      error: error.message
    });
  }
};

// 2. Ambil Detail Single Film Berdasarkan ID (GET)
const getFilmById = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findByPk(id);

    if (!film) {
      return res.status(404).json({
        success: false,
        message: 'Film tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail film',
      data: film
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail film',
      error: error.message
    });
  }
};

// 3. Tambah Film Baru (POST)
const createFilm = async (req, res) => {
  try {
    const { 
      title, 
      director, 
      dop, 
      genre, 
      age_rating, 
      duration, 
      synopsis 
    } = req.body;

    if (!title) {
      await removeCloudinaryFile(req);
      return res.status(400).json({
        success: false,
        message: 'Judul film (title) wajib diisi'
      });
    }

    // Jika user mengunggah file poster via Multer Cloudinary, ambil req.file.path.
    // Jika tidak ada file, tetap dukung input string poster_url dari req.body.
    const posterUrl = req.file ? req.file.path : req.body.poster_url || null;

    const newFilm = await Film.create({
      title,
      poster_url: posterUrl,
      director,
      dop,
      genre,
      age_rating,
      duration,
      synopsis
    });

    return res.status(201).json({
      success: true,
      message: 'Film berhasil ditambahkan',
      data: newFilm
    });
  } catch (error) {
    await removeCloudinaryFile(req);
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan film',
      error: error.message
    });
  }
};

// 4. Hapus Film Berdasarkan ID (DELETE)
const deleteFilm = async (req, res) => {
  try {
    const { id } = req.params;
    const film = await Film.findByPk(id);

    if (!film) {
      return res.status(404).json({
        success: false,
        message: 'Film tidak ditemukan'
      });
    }

    // Jika film memiliki poster_url di Cloudinary, hapus filenya dari Cloudinary
    if (film.poster_url) {
      const publicId = getPublicIdFromUrl(film.poster_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch((err) => {
          console.error('Gagal menghapus poster dari Cloudinary:', err.message);
        });
      }
    }

    await film.destroy();

    return res.status(200).json({
      success: true,
      message: 'Film berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus film',
      error: error.message
    });
  }
};

module.exports = {
  getAllFilms,
  getFilmById,
  createFilm,
  deleteFilm
};