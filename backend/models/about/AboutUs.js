const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const AboutUs = sequelize.define('AboutUs', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image_url: { type: DataTypes.STRING }
}, { timestamps: true, tableName: 'about_us' });

module.exports = AboutUs;