const express = require('express');
const router = express.Router();

const { 
  getAllPrograms, 
  getProgramById, 
  addFilmToProgram,
  createProgram,
  deleteProgram
} = require('../controllers/programController');

// GET /api/programs -> Ambil semua program
router.get('/', getAllPrograms);

// GET /api/programs/:id -> Detail program berdasarkan ID atau Slug
router.get('/:id', getProgramById);

// POST /api/programs -> Buat program baru
router.post('/', createProgram);

// POST /api/programs/:id/films -> Hubungkan Film ke Program
router.post('/:id/films', addFilmToProgram);

// DELETE /api/programs/:id -> Hapus program berdasarkan ID
router.delete('/:id', deleteProgram);

module.exports = router;