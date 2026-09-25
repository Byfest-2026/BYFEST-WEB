const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Film = sequelize.define('Film', {
  id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  poster_url: { type: DataTypes.STRING },
  director: { type: DataTypes.STRING },
  dop: { type: DataTypes.STRING },
  genre: { type: DataTypes.STRING },
  age_rating: { type: DataTypes.STRING },
  duration: { type: DataTypes.INTEGER },
  synopsis: { type: DataTypes.TEXT }
}, { timestamps: true, tableName: 'films' });

module.exports = Film;