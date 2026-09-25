const { Venue } = require('../models');

// Buat Venue Baru
const createVenue = async (req, res) => {
  try {
    const { name, address, capacity } = req.body;

    const newVenue = await Venue.create({
      name,
      address,
      capacity
    });

    return res.status(201).json({
      success: true,
      message: 'Venue berhasil ditambahkan',
      data: newVenue
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan venue',
      error: error.message
    });
  }
};

// Ambil Semua Venue
const getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll();
    return res.status(200).json({ success: true, data: venues });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createVenue, getAllVenues };