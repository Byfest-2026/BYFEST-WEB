const { 
  AboutUs, 
  Lead, 
  CategoryAward, 
  WinnerAward, 
  Film, 
  GalleryDocumentation 
} = require('../models');

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
    // Dukung properti division, role, atau jabatan
    const division = req.body.division || req.body.role || req.body.jabatan;
    const faculty = req.body.faculty || req.body.fakultas;
    const photo_url = req.file 
      ? `/uploads/leads/${req.file.filename}` 
      : (req.body.photo_url || req.body.photo || req.body.image);

    if (!name || !division) {
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

    // Ambil path gambar jika di-upload via Multer, atau dari body JSON
    const image = req.file 
      ? `/uploads/winners/${req.file.filename}` 
      : (req.body.image || req.body.photo || null);

    // Validasi field yang wajib diisi sesuai model baru
    if (!year || !category || !film) {
      return res.status(400).json({ 
        success: false, 
        message: 'Field year, category, dan film wajib diisi' 
      });
    }

    // Buat data baru menggunakan field yang ada di model WinnerAward
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

const createGalleryItem = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Ambil path gambar dari file Multer ATAU dari body (media_url / image_url / image)
    const media_url = req.file 
      ? `/uploads/gallery/${req.file.filename}` 
      : (req.body.media_url || req.body.image_url || req.body.image);

    // Validasi field wajib
    if (!media_url) {
      return res.status(400).json({
        success: false,
        message: 'File gambar atau media_url wajib diisi'
      });
    }

    const newDoc = await GalleryDocumentation.create({
      title,
      description,
      media_url
    });

    return res.status(201).json({
      success: true,
      message: 'Dokumentasi berhasil ditambahkan',
      data: newDoc
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await GalleryDocumentation.findByPk(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Dokumentasi tidak ditemukan' });
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