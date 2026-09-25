const express = require('express');
const router = express.Router();
const { createVenue, getAllVenues } = require('../controllers/venueController');

router.post('/', createVenue);
router.get('/', getAllVenues);

module.exports = router;