const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Impor middleware upload Cloudinary
const { 
  getAllFilms, 
  getFilmById, 
  createFilm,
  deleteFilm
} = require('../controllers/filmController');

// Route GET /api/films
router.get('/', getAllFilms);

// Route GET /api/films/:id
router.get('/:id', getFilmById);

// Route POST /api/films (dengan middleware upload poster ke Cloudinary)
router.post('/', upload.single('poster_url'), createFilm);

// Route DELETE /api/films/:id 
router.delete('/:id', deleteFilm);

module.exports = router;