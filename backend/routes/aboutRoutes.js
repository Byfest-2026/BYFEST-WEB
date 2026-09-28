const express = require('express');
const router = express.Router();

// Middleware upload Cloudinary
const upload = require('../middleware/upload');

// Import controller
const {
  getAboutData,
  getAboutContent,
  // Leads
  getLeads,
  createLead,
  deleteLead,
  // Awards
  getAwards,
  createAwardWinner,
  deleteAwardWinner,
  // Gallery
  getGallery,
  createGalleryItem,
  deleteGalleryItem
} = require('../controllers/aboutController');

// GET /api/about (Ambil seluruh data About Us sekaligus untuk frontend)
router.get('/', getAboutData);

// GET /api/about/content (Ambil hanya deskripsi/profil About Us)
router.get('/content', getAboutContent);

// LEADS ROUTES
router.get('/leads', getLeads);
router.post('/leads', upload.single('photo_url'), createLead);
router.delete('/leads/:id', deleteLead);

// AWARDS ROUTES
router.get('/awards', getAwards);
router.post('/awards', upload.single('image'), createAwardWinner);
router.delete('/awards/:id', deleteAwardWinner);

// GALLERY ROUTES
router.get('/gallery', getGallery);
router.post('/gallery', upload.single('media_url'), createGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

module.exports = router;