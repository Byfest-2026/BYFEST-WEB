const {
  HomeContent,
  TrailerByfest,
  Curator,
  Sponsorship,
  MediaPartner,
  Community
} = require('../models');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary dari Environment Variables Vercel / .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper untuk mengekstrak public_id Cloudinary dari URL gambar
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const filename = parts.pop().split('.')[0];
    const folder = parts.pop();
    return `\({folder}/\){filename}`;
  } catch (err) {
    return null;
  }
};

// Helper untuk menghapus file dari Cloudinary jika transaksi/validasi gagal
const removeCloudinaryFile = async (req) => {
  if (req.file && req.file.path) {
    const publicId = getPublicIdFromUrl(req.file.path);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch((err) => {
        console.error('Gagal menghapus file rollback Cloudinary:', err.message);
      });
    }
  }
};

// ==========================================
// 1. HOME & HERO CONTENT
// ==========================================

// Ambil Seluruh Data Halaman Home Sekaligus
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

// Ambil Hero/Home Content Sahaja
const getHomeContent = async (req, res) => {
  try {
    const content = await HomeContent.findOne({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Tambah atau Update Hero/Home Content (Admin)
const updateHomeContent = async (req, res) => {
  try {
    const { title, description, button_text, button_link } = req.body;

    // Ambil URL Cloudinary jika mengunggah file hero image
    const hero_image = req.file ? req.file.path : req.body.hero_image || null;

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
    await removeCloudinaryFile(req);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 2. CURATOR CRUD
// ==========================================

// Ambil Daftar Kurator
const getCurators = async (req, res) => {
  try {
    const curators = await Curator.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: curators });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Tambah Kurator Baru (Admin)
const createCurator = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    const bio = req.body.bio || req.body.desc || req.body.description || req.body.role;
    
    // Ambil URL Cloudinary dari file atau falling back ke body text
    const photo = req.file ? req.file.path : (req.body.photo_url || req.body.photo || req.body.avatar || req.body.image || req.body.foto);

    if (!name) {
      await removeCloudinaryFile(req);
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
    await removeCloudinaryFile(req);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Edit Kurator (PUT)
const updateCurator = async (req, res) => {
  try {
    const { id } = req.params;
    const curator = await Curator.findByPk(id);

    if (!curator) {
      await removeCloudinaryFile(req);
      return res.status(404).json({ success: false, message: 'Kurator tidak ditemukan' });
    }

    const name = req.body.name || req.body.nama || curator.name;
    const bio = req.body.bio !== undefined ? req.body.bio : curator.bio;
    
    // Jika ada foto baru yang diunggah, hapus foto lama dari Cloudinary
    let photo = curator.photo_url;
    if (req.file) {
      if (curator.photo_url) {
        const oldPublicId = getPublicIdFromUrl(curator.photo_url);
        if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId).catch(() => {});
      }
      photo = req.file.path;
    } else if (req.body.photo_url || req.body.photo) {
      photo = req.body.photo_url || req.body.photo;
    }

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
    await removeCloudinaryFile(req);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Hapus Kurator (Admin)
const deleteCurator = async (req, res) => {
  try {
    const { id } = req.params;

    const curator = await Curator.findByPk(id);
    if (!curator) {
      return res.status(404).json({ success: false, message: 'Kurator tidak ditemukan' });
    }

    // Hapus foto dari Cloudinary
    if (curator.photo_url) {
      const publicId = getPublicIdFromUrl(curator.photo_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
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
// 3. SPONSORSHIP CRUD
// ==========================================

const getSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: sponsorships });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createSponsorship = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    const logo_url = req.file ? req.file.path : (req.body.logo_url || req.body.logo || req.body.photo_url || req.body.image);

    if (!name) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ success: false, message: 'Nama sponsor wajib diisi' });
    }

    if (!logo_url) {
      await removeCloudinaryFile(req);
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
    await removeCloudinaryFile(req);
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

    const logo = sponsor.logo_url || sponsor.logo;
    if (logo) {
      const publicId = getPublicIdFromUrl(logo);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await sponsor.destroy();
    return res.status(200).json({ success: true, message: 'Sponsor berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 4. MEDIA PARTNER CRUD
// ==========================================

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
    const logo_url = req.file ? req.file.path : (req.body.logo_url || req.body.logo || req.body.photo_url || req.body.image);

    if (!name) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ success: false, message: 'Nama media partner wajib diisi' });
    }
    
    if (!logo_url) {
      await removeCloudinaryFile(req);
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
    await removeCloudinaryFile(req);
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

    const logo = mediaPartner.logo_url || mediaPartner.logo;
    if (logo) {
      const publicId = getPublicIdFromUrl(logo);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await mediaPartner.destroy();
    return res.status(200).json({ success: true, message: 'Media partner berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 5. COMMUNITY CRUD
// ==========================================

const getCommunities = async (req, res) => {
  try {
    const communities = await Community.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json({ success: true, data: communities });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createCommunity = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    const logo_url = req.file ? req.file.path : (req.body.logo_url || req.body.logo || req.body.image);

    if (!name) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ success: false, message: 'Nama community wajib diisi' });
    }

    if (!logo_url) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ success: false, message: 'Logo community (logo_url) wajib diisi' });
    }

    const newCommunity = await Community.create({
      name,
      logo_url
    });

    return res.status(201).json({
      success: true,
      message: 'Community berhasil ditambahkan',
      data: newCommunity
    });
  } catch (error) {
    await removeCloudinaryFile(req);
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

    const logo = community.logo_url || community.logo;
    if (logo) {
      const publicId = getPublicIdFromUrl(logo);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await community.destroy();
    return res.status(200).json({ success: true, message: 'Komunitas berhasil dihapus' });
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