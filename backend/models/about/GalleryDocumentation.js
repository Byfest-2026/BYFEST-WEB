const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const GalleryDocumentation = sequelize.define('GalleryDocumentation', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  media_url: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
}, { 
  timestamps: true, 
  updatedAt: false, 
  tableName: 'gallery_documentations' 
});

module.exports = GalleryDocumentation;