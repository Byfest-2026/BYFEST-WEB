const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const TrailerByfest = sequelize.define('TrailerByfest', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING },
  video_url: { type: DataTypes.STRING, allowNull: false },
  thumbnail_url: { type: DataTypes.STRING }
}, { timestamps: true, updatedAt: false, tableName: 'trailers_byfest' });

module.exports = TrailerByfest;