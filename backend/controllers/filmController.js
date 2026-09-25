const { Film } = require('../models');

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
      poster_url, 
      director, 
      dop, 
      genre, 
      age_rating, 
      duration, 
      synopsis 
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Judul film (title) wajib diisi'
      });
    }

    const newFilm = await Film.create({
      title,
      poster_url,
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