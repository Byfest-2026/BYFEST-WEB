const express = require('express');
const router = express.Router();
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
router.post('/curators', createCurator);
router.put('/curators/:id', updateCurator);
router.delete('/curators/:id', deleteCurator);

// Sponsorships
router.get('/sponsorships', getSponsorships);
router.post('/sponsorships', createSponsorship);
router.delete('/sponsorships/:id', deleteSponsorship);

// Media Partners
router.get('/media-partners', getMediaPartners);
router.post('/media-partners', createMediaPartner);
router.delete('/media-partners/:id', deleteMediaPartner);

// Communities
router.get('/community', getCommunities);
router.post('/community', createCommunity);
router.delete('/community/:id', deleteCommunity);

module.exports = router;