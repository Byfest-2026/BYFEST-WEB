const { Program, Film, Venue, TicketType } = require('../models');
const cloudinary = require('cloudinary').v2;

// Konfigurasi Cloudinary dari Environment Variables
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

// 1. Ambil Seluruh Program Beserta Daftar Film, Venue, & Tiket
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll({
      attributes: [
        'id', 'name', 'slug', 'image', 'description',
        'date', 'start_time', 'end_time', 'age_rating', 'quota'
      ],
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: Film,
          as: 'films',
          through: { attributes: [] }, // Sembunyikan junction table (ProgramFilm)
          attributes: ['id', 'title', 'director', 'duration', 'poster_url', 'synopsis']
        },
        {
          model: TicketType,
          as: 'ticket_types',
          attributes: ['id', 'name', 'price', 'quota', 'category']
        },
        {
          model: TicketType,
          as: 'included_in_passes',
          through: { attributes: [] }, // Sembunyikan junction table (ticket_type_programs)
          attributes: ['id', 'name', 'price', 'category']
        }
      ],
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      message: 'Berhasil mengambil daftar program',
      data: programs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data program',
      error: error.message
    });
  }
};

// 2. Ambil Detail Single Program Berdasarkan ID atau Slug
const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah parameter berupa Angka (ID) atau String (Slug)
    const isNumeric = !isNaN(id);
    const queryCondition = isNumeric ? { id: parseInt(id) } : { slug: id };

    const program = await Program.findOne({
      where: queryCondition,
      include: [
        {
          model: Venue,
          as: 'venue'
        },
        {
          model: Film,
          as: 'films',
          through: { attributes: [] }
        },
        {
          model: TicketType,
          as: 'ticket_types'
        },
        {
          model: TicketType,
          as: 'included_in_passes',
          through: { attributes: [] }
        }
      ]
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program tidak ditemukan'
      });
    }

    return res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail program',
      error: error.message
    });
  }
};

// 3. Tambahkan Film ke Dalam Program (Relasi Junction Table)
const addFilmToProgram = async (req, res) => {
  try {
    const { id } = req.params; // ID atau Slug Program
    const { film_id } = req.body;

    if (!film_id) {
      return res.status(400).json({
        success: false,
        message: 'film_id wajib diisi'
      });
    }

    const isNumeric = !isNaN(id);
    const queryCondition = isNumeric ? { id: parseInt(id) } : { slug: id };

    const program = await Program.findOne({ where: queryCondition });
    const film = await Film.findByPk(film_id);

    if (!program || !film) {
      return res.status(404).json({
        success: false,
        message: 'Program atau Film tidak ditemukan'
      });
    }

    // Cek apakah relasi sudah ada untuk mencegah duplikasi
    const hasFilm = await program.hasFilms(film);
    if (hasFilm) {
      return res.status(400).json({
        success: false,
        message: `Film "${film.title}" sudah terdaftar di dalam Program ini`
      });
    }

    // Menambahkan film ke program lewat method Sequelize
    await program.addFilms(film);

    return res.status(200).json({
      success: true,
      message: `Film "\({film.title}" berhasil ditambahkan ke Program "\){program.name}"`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan film ke program',
      error: error.message
    });
  }
};

// 4. Buat Program Baru (Dukungan Cloudinary Upload)
const createProgram = async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      synopsis,
      date,
      start_time,
      end_time,
      age_rating,
      quota,
      venue_id
    } = req.body;

    const programName = name || title;

    if (!programName) {
      await removeCloudinaryFile(req);
      return res.status(400).json({
        success: false,
        message: 'Nama program (name) wajib diisi'
      });
    }

    // Ambil URL Cloudinary dari req.file.path jika file diunggah
    const imageUrl = req.file ? req.file.path : (req.body.image || null);

    // Generator slug otomatis dari nama program
    const generatedSlug = programName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const newProgram = await Program.create({
      name: programName,
      slug: generatedSlug,
      image: imageUrl,
      description: description || synopsis,
      date,
      start_time,
      end_time,
      age_rating: age_rating || null,
      quota: quota,
      venue_id
    });

    return res.status(201).json({
      success: true,
      message: 'Program berhasil dibuat',
      data: newProgram
    });
  } catch (error) {
    await removeCloudinaryFile(req);
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat program',
      error: error.message
    });
  }
};

// 5. Hapus Program (Hapus File di Cloudinary)
const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program tidak ditemukan' });
    }

    // Hapus file gambar dari Cloudinary jika ada
    if (program.image) {
      const publicId = getPublicIdFromUrl(program.image);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await program.destroy();
    return res.status(200).json({ success: true, message: 'Program berhasil dihapus' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllPrograms,
  getProgramById,
  addFilmToProgram,
  createProgram,
  deleteProgram
};