const {
  HomeContent,
  TrailerByfest,
  Curator,
  Sponsorship,
  MediaPartner,
  Community
} = require('../models');
const fs = require('fs');
const path = require('path');

// 1. Ambil Seluruh Data Halaman Home Sekaligus
const getHomeData = async (req, res) => {
  try {
    const [heroContent, trailers, curators, sponsorships, mediaPartners, communities] = await Promise.all([
      HomeContent.findOne({ order: [['createdAt', 'DESC']] }),
      TrailerByfest.findAll({ order: [['createdAt', 'DESC']] }),
      Curator.findAll({ order: [['id', 'ASC']] }),
      Sponsorship.findAll({ order: [['id', 'ASC']] }),
      MediaPartner.findAll({ order: [['id', 'ASC']] }),
      Community.findAll({ order: [['id', 'ASC']] })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Data tab Home berhasil diambil',
      data: {
        hero: heroContent,
        trailers,
        curators,
        sponsorships,
        mediaPartners,
        communities
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data Home',
      error: error.message
    });
  }
};

// 2. Ambil Hero/Home Content Sahaja
const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Tambah atau Update Hero/Home Content (Admin)
const updateHomeContent = async (req, res) => {
  try {
    const { title, description, hero_image, button_text, button_link } = req.body;

    const newContent = await HomeContent.create({
      title,
      description,
      hero_image,
      button_text,
      button_link
    });

    return res.status(201).json({
      success: true,
      message: 'Home content berhasil diperbarui',
      data: newContent
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Ambil Daftar Kurator
const getCurators = async (req, res) => {
  try {
    const curators = await Curator.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: curators });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Tambah Kurator Baru (Admin)
const createCurator = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    const bio = req.body.bio || req.body.desc || req.body.description || req.body.role;
    const photo = req.body.photo_url || req.body.photo || req.body.avatar || req.body.image || req.body.foto;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama kurator wajib diisi' });
    }

    const newCurator = await Curator.create({
      name,
      bio,
      photo_url: photo || null
    });

    return res.status(201).json({
      success: true,
      message: 'Kurator berhasil ditambahkan',
      data: newCurator
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 6. Edit Kurator (PUT)
const updateCurator = async (req, res) => {
  try {
    const { id } = req.params;
    const curator = await Curator.findByPk(id);

    if (!curator) {
      return res.status(404).json({ success: false, message: 'Kurator tidak ditemukan' });
    }

    const name = req.body.name || req.body.nama || curator.name;
    const bio = req.body.bio !== undefined ? req.body.bio : curator.bio;
    const photo = req.body.photo_url || req.body.photo || req.body.avatar || req.body.image || curator.photo_url;

    await curator.update({
      name,
      bio,
      photo_url: photo
    });

    return res.status(200).json({
      success: true,
      message: 'Kurator berhasil diperbarui',
      data: curator
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 7. Hapus Kurator (Admin)
const deleteCurator = async (req, res) => {
  try {
    const { id } = req.params;

    const curator = await Curator.findByPk(id);
    if (!curator) {
      return res.status(404).json({ success: false, message: 'Kurator tidak ditemukan' });
    }

    if (curator.photo_url) {
      const filePath = path.join(__dirname, '..', curator.photo_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await curator.destroy();

    return res.status(200).json({
      success: true,
      message: 'Kurator berhasil dihapus'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 8. SPONSORSHIP CRUD
// ==========================================
const createSponsorship = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    const logo_url = req.body.logo_url || req.body.logo || req.body.photo_url || req.body.image;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama sponsor wajib diisi' });
    }

    if (!logo_url) {
      return res.status(400).json({ success: false, message: 'Logo sponsor (logo_url) wajib diisi' });
    }

    const newSponsorship = await Sponsorship.create({
      name,
      logo_url
    });

    return res.status(201).json({
      success: true,
      message: 'Sponsor berhasil ditambahkan',
      data: newSponsorship
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteSponsorship = async (req, res) => {
  try {
    const { id } = req.params;
    const sponsor = await Sponsorship.findByPk(id);

    if (!sponsor) {
      return res.status(404).json({ success: false, message: 'Sponsor tidak ditemukan' });
    }

    if (sponsor.logo) {
      const filePath = path.join(__dirname, '..', sponsor.logo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await sponsor.destroy();
    return res.status(200).json({ success: true, message: 'Sponsor berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
// Ambil seluruh daftar Sponsorship
const getSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: sponsorships });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 9. MEDIA PARTNER CRUD
// ==========================================
// Ambil seluruh daftar Media Partner
const getMediaPartners = async (req, res) => {
  try {
    const mediaPartners = await MediaPartner.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: mediaPartners });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
const createMediaPartner = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    
    // 1. Tambahkan req.body.logo_url di pilihan paling awal
    //    serta dukung req.file jika mengunggah file via Multer
    const logo_url = req.file 
      ? `/uploads/media-partner/${req.file.filename}` 
      : (req.body.logo_url || req.body.logo || req.body.photo_url || req.body.image);

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama media partner wajib diisi' });
    }
    
    // 2. Perbaiki pesan error agar sesuai dengan Media Partner
    if (!logo_url) {
      return res.status(400).json({ success: false, message: 'Logo media partner (logo_url) wajib diisi' });
    }

    const newMediaPartner = await MediaPartner.create({
      name,
      logo_url
    });

    return res.status(201).json({
      success: true,
      message: 'Media partner berhasil ditambahkan',
      data: newMediaPartner
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteMediaPartner = async (req, res) => {
  try {
    const { id } = req.params;
    const mediaPartner = await MediaPartner.findByPk(id);

    if (!mediaPartner) {
      return res.status(404).json({ success: false, message: 'Media partner tidak ditemukan' });
    }

    if (mediaPartner.logo) {
      const filePath = path.join(__dirname, '..', mediaPartner.logo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await mediaPartner.destroy();
    return res.status(200).json({ success: true, message: 'Media partner berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 10. COMMUNITY CRUD
// ==========================================
const createCommunity = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    // Ambil path gambar dari req.file (jika multer) atau dari req.body
    const logo_url = req.file 
      ? `/uploads/comunnity/${req.file.filename}` 
      : (req.body.logo_url || req.body.logo || req.body.image);

    if (!name) {
      return res.status(400).json({ success: false, message: 'Nama community wajib diisi' });
    }

    if (!logo_url) {
      return res.status(400).json({ success: false, message: 'Logo community (logo_url) wajib diisi' });
    }

    const newCommunity = await Community.create({
      name,
      logo_url // Masukkan ke kolom logo_url
    });

    return res.status(201).json({
      success: true,
      message: 'Community berhasil ditambahkan',
      data: newCommunity
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const community = await Community.findByPk(id);

    if (!community) {
      return res.status(404).json({ success: false, message: 'Komunitas tidak ditemukan' });
    }

    if (community.logo) {
      const filePath = path.join(__dirname, '..', community.logo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await community.destroy();
    return res.status(200).json({ success: true, message: 'Komunitas berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
// Ambil seluruh daftar Community
const getCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: communities });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
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
};