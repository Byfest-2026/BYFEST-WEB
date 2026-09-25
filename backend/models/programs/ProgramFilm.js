const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/db');

const ProgramFilm = sequelize.define('ProgramFilm', {
  program_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Jadi primary key gabungan
    allowNull: false
  },
  film_id: {
    type: DataTypes.INTEGER,
    primaryKey: true, // Jadi primary key gabungan
    allowNull: false
  }
}, {
  tableName: 'program_films',
  timestamps: false
});

module.exports = ProgramFilm;