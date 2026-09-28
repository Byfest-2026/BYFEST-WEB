const { 
  AboutUs, 
  Lead, 
  CategoryAward, 
  WinnerAward, 
  Film, 
  GalleryDocumentation 
} = require('../models');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary dari Environment Variables Vercel
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
    return `\({folder}/\){filename}`; // ⚠️ Sudah diperbaiki menggunakan ${}
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
// 1. DATA GABUNGAN & ABOUT US
// ==========================================

const getAboutData = async (req, res) => {
  try {
    const [aboutContent, leads, winners, gallery] = await Promise.all([
      AboutUs.findOne({ order: [['createdAt', 'DESC']] }),
      Lead.findAll({ order: [['name', 'ASC']] }),
      WinnerAward.findAll({ order: [['year', 'DESC']] }),
      GalleryDocumentation.findAll({ order: [['createdAt', 'DESC']] })
    ]);

    return res.status(200).json({
      success: true,
      message: 'Data tab About Us berhasil diambil',
      data: {
        about: aboutContent,
        leads,
        winners,
        gallery
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data About Us',
      error: error.message
    });
  }
};

const getAboutContent = async (req, res) => {
  try {
    const content = await AboutUs.findOne({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 2. LEADS MODULE (GET, CREATE, DELETE)
// ==========================================

const getLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json({ success: true, data: leads });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createLead = async (req, res) => {
  try {
    const name = req.body.name || req.body.nama;
    const division = req.body.division || req.body.role || req.body.jabatan;
    const faculty = req.body.faculty || req.body.fakultas;
    
    // Ambil URL Cloudinary dari req.file.path jika file diunggah
    const photo_url = req.file 
      ? req.file.path 
      : (req.body.photo_url || req.body.photo || req.body.image);

    if (!name || !division) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ 
        success: false, 
        message: 'Nama dan divisi/jabatan lead wajib diisi' 
      });
    }

    const newLead = await Lead.create({
      name,
      division,
      faculty: faculty || null,
      photo_url: photo_url || null
    });

    return res.status(201).json({
      success: true,
      message: 'Lead berhasil ditambahkan',
      data: newLead
    });
  } catch (error) {
    await removeCloudinaryFile(req);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Data lead tidak ditemukan' });
    }

    // Hapus foto dari Cloudinary jika ada
    if (lead.photo_url) {
      const publicId = getPublicIdFromUrl(lead.photo_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await lead.destroy();
    return res.status(200).json({ success: true, message: 'Lead berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 3. AWARDS MODULE (GET, CREATE, DELETE)
// ==========================================

const getAwards = async (req, res) => {
  try {
    const winners = await WinnerAward.findAll({
      include: [
        {
          model: CategoryAward,
          as: 'category',
          attributes: ['id', 'name', 'description']
        },
        {
          model: Film,
          as: 'film',
          attributes: ['id', 'title', 'director', 'poster_url']
        }
      ]
    });
    return res.status(200).json({ success: true, data: winners });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const createAwardWinner = async (req, res) => {
  try {
    const { year, category, film, person, instansi } = req.body;

    // Ambil URL Cloudinary dari req.file.path jika file diunggah
    const image = req.file 
      ? req.file.path 
      : (req.body.image || req.body.photo || null);

    if (!year || !category || !film) {
      await removeCloudinaryFile(req);
      return res.status(400).json({ 
        success: false, 
        message: 'Field year, category, dan film wajib diisi' 
      });
    }

    const newWinner = await WinnerAward.create({
      year,
      category,
      film,
      person: person || null,
      instansi: instansi || null,
      image
    });

    return res.status(201).json({
      success: true,
      message: 'Pemenang award berhasil ditambahkan',
      data: newWinner
    });
  } catch (error) {
    await removeCloudinaryFile(req);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const deleteAwardWinner = async (req, res) => {
  try {
    const { id } = req.params;
    const winner = await WinnerAward.findByPk(id);

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Data pemenang award tidak ditemukan' });
    }

    // Hapus foto pemenang dari Cloudinary jika ada
    if (winner.image) {
      const publicId = getPublicIdFromUrl(winner.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await winner.destroy();
    return res.status(200).json({ success: true, message: 'Data pemenang award berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// 4. DOCUMENTATION GALLERY (GET, CREATE, DELETE)
// ==========================================

const getGallery = async (req, res) => {
  try {
    const gallery = await GalleryDocumentation.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json({ success: true, data: gallery });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const GalleryDocumentation = require('../models/GalleryDocumentation'); // Sesuaikan path model kamu

const createGalleryItem = async (req, res) => {
  try {
    // 1. Ambil title & description dari req.body
    const { title, description } = req.body;

    // Validasi judul wajib diisi (karena allowNull: false di model)
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title wajib diisi'
      });
    }

    // 2. Tangkap URL gambar dari req.file (Cloudinary) atau req.body.media_url
    let media_url = null;

    if (req.file && req.file.path) {
      media_url = req.file.path;
    } else if (req.body && (req.body.media_url || req.body.image_url || req.body.media)) {
      media_url = req.body.media_url || req.body.image_url || req.body.media;
    }

    // Validasi file/URL gambar wajib diisi (karena allowNull: false di model)
    if (!media_url) {
      return res.status(400).json({
        success: false,
        message: 'File gambar atau media_url wajib diisi'
      });
    }

    // 3. Simpan ke database menggunakan nama atribut yang sesuai dengan model
    const newItem = await GalleryDocumentation.create({
      title: title,
      description: description || null,
      media_url: media_url
    });

    return res.status(201).json({
      success: true,
      message: 'Berhasil menambahkan item galeri',
      data: newItem
    });
  } catch (error) {
    console.error('Error createGalleryItem:', error);

    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan item galeri',
      error: error.message
    });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryDocumentation.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Dokumentasi tidak ditemukan' });
    }

    // Hapus file media dokumentasi dari Cloudinary
    if (item.media_url) {
      const publicId = getPublicIdFromUrl(item.media_url);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await item.destroy();
    return res.status(200).json({ success: true, message: 'Dokumentasi berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
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
};