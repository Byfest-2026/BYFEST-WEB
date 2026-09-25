const express = require('express');
const router = express.Router();
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

// Route POST /api/films
router.post('/', createFilm);

// DELETE /api/films/:id 
router.delete('/:id', deleteFilm);

module.exports = router;