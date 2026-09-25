const { Program, Film, Venue, TicketType } = require('../models');

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
      message: `Film "${film.title}" berhasil ditambahkan ke Program "${program.name}"`
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal menambahkan film ke program',
      error: error.message
    });
  }
};

// 4. Buat Program Baru
// Buat Program Baru
const createProgram = async (req, res) => {
  try {
    const {
      name,
      title,
      image,
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
      return res.status(400).json({
        success: false,
        message: 'Nama program (name) wajib diisi'
      });
    }

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
      image: image || null,
      description: description || synopsis,
      date,
      start_time,
      end_time,
      age_rating: age_rating || null, // Diambil dinamis dari input request
      quota: quota,                   // Menggunakan quota langsung sesuai input JSON
      venue_id
    });

    return res.status(201).json({
      success: true,
      message: 'Program berhasil dibuat',
      data: newProgram
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Gagal membuat program',
      error: error.message
    });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const program = await Program.findByPk(id);

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program tidak ditemukan' });
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