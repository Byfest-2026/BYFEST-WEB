const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const HomeContent = sequelize.define('HomeContent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  hero_image: { type: DataTypes.STRING },
  button_text: { type: DataTypes.STRING },
  button_link: { type: DataTypes.STRING }
}, { timestamps: true, tableName: 'home_contents' });

module.exports = HomeContent;