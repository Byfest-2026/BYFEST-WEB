const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');

const {
  getHomeData,
  getHomeContent,
  updateHomeContent,
  getCurators,
  createCurator,
  updateCurator,
  deleteCurator,
  getSponsorships,
  createSponsorship,
  deleteSponsorship,
  getMediaPartners,
  createMediaPartner,
  deleteMediaPartner,
  getCommunities,
  createCommunity,
  deleteCommunity
} = require('../controllers/homeController');

// GET /api/home -> Mengambil semua section halaman home sekaligus
router.get('/', getHomeData);

// GET & POST /api/home/content -> Mengelola banner/hero utama
router.get('/content', getHomeContent);
router.post('/content', updateHomeContent);

// Curators
router.get('/curators', getCurators);
router.post('/curators',upload.single('photo_url'), createCurator);
router.put('/curators/:id', updateCurator);
router.delete('/curators/:id', deleteCurator);

// Sponsorships
router.get('/sponsorships', getSponsorships);
router.post('/sponsorships', upload.single('logo_url'), createSponsorship);
router.delete('/sponsorships/:id', deleteSponsorship);

// Media Partners
router.get('/media-partners', getMediaPartners);
router.post('/media-partners', upload.single('logo_url'), createMediaPartner);
router.delete('/media-partners/:id', deleteMediaPartner);

// Communities
router.get('/community', getCommunities);
router.post('/community', upload.single('logo_url'), createCommunity);
router.delete('/community/:id', deleteCommunity);

module.exports = router;