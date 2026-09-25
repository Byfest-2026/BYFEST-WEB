const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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
} = require('../controllers/aboutController'); // Sesuaikan path controller kamu

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder penyimpanan berdasarkan route
    if (req.originalUrl.includes('leads')) {
      cb(null, 'uploads/leads/');
    } else if (req.originalUrl.includes('gallery')) {
      cb(null, 'uploads/gallery/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET /api/about (Ambil seluruh data About Us sekaligus untuk frontend)
router.get('/', getAboutData);

// GET /api/about/content (Ambil hanya deskripsi/profil About Us)
router.get('/content', getAboutContent);

// GET /api/about/leads
router.get('/leads', getLeads);

// POST /api/about/leads (Mendukung upload file 'photo' atau 'photo_url')
router.post('/leads', upload.single('photo'), createLead);

// DELETE /api/about/leads/:id
router.delete('/leads/:id', deleteLead);

// GET /api/about/awards
router.get('/awards', getAwards);

// POST /api/about/awards
router.post('/awards', createAwardWinner);

// DELETE /api/about/awards/:id
router.delete('/awards/:id', deleteAwardWinner);

// GET /api/about/gallery
router.get('/gallery', getGallery);

// POST /api/about/gallery (Mendukung upload file 'image' atau 'image_url')
router.post('/gallery', upload.single('image'), createGalleryItem);

// DELETE /api/about/gallery/:id
router.delete('/gallery/:id', deleteGalleryItem);

module.exports = router;