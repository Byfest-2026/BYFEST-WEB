const { sequelize } = require('../config/db');

// 1. Import Models dari Sub-folder Home
const HomeContent = require('./home/HomeContent');
const TrailerByfest = require('./home/TrailerByfest');
const Curator = require('./home/Curator');
const Sponsorship = require('./home/Sponsorship');
const MediaPartner = require('./home/MediaPartner');
const Community = require('./home/Community');

// 2. Import Models dari Sub-folder About
const AboutUs = require('./about/AboutUs');
const Lead = require('./about/Lead');
const CategoryAward = require('./about/CategoryAward');
const WinnerAward = require('./about/WinnerAward');
const GalleryDocumentation = require('./about/GalleryDocumentation');

// 3. Import Models dari Sub-folder Program
const Venue = require('./programs/Venue');
const Program = require('./programs/Program');
const Film = require('./programs/Film');
const ProgramFilm = require('./programs/ProgramFilm');

// 4. Import Models dari Sub-folder Ticketing
const TicketType = require('./ticketing/TicketType');
const Order = require('./ticketing/Order');
// (Hapus baris Payment & OrderItem)

// ==========================================
// DEFINISI RELASI ANTAR ENTITAS
// ==========================================

// Relasi Venue & Program
Venue.hasMany(Program, { foreignKey: 'venue_id', as: 'programs' });
Program.belongsTo(Venue, { foreignKey: 'venue_id', as: 'venue' });

// Relasi Many-to-Many: Program & Film (via ProgramFilm)
Program.belongsToMany(Film, { 
  through: ProgramFilm, 
  foreignKey: 'program_id', 
  otherKey: 'film_id',
  as: 'films' 
});
Film.belongsToMany(Program, { 
  through: ProgramFilm, 
  foreignKey: 'film_id', 
  otherKey: 'program_id',
  as: 'programs' 
});

// ------------------------------------------
// RELASI TICKETING & PROGRAM
// ------------------------------------------

// 1. Tiket Single Program
Program.hasMany(TicketType, { foreignKey: 'program_id', as: 'ticket_types' });
TicketType.belongsTo(Program, { foreignKey: 'program_id', as: 'program' });

// 2. Tiket Pass / Bundling (Multi-Program via Tabel Junction 'ticket_type_programs')
TicketType.belongsToMany(Program, {
  through: 'ticket_type_programs',
  foreignKey: 'ticket_type_id',
  otherKey: 'program_id',
  as: 'covered_programs',
  timestamps: false
});

Program.belongsToMany(TicketType, {
  through: 'ticket_type_programs',
  foreignKey: 'program_id',
  otherKey: 'ticket_type_id',
  as: 'included_in_passes',
  timestamps: false
});

// Export Seluruh Model dan Instance Sequelize
module.exports = {
  sequelize,
  HomeContent, TrailerByfest, Curator, Sponsorship, MediaPartner, Community,
  AboutUs, Lead, CategoryAward, WinnerAward, GalleryDocumentation,
  Venue, Program, Film, ProgramFilm,
  TicketType, Order
};