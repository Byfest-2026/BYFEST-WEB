const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const MediaPartner = sequelize.define('MediaPartner', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  logo_url: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  }
}, { timestamps: false, tableName: 'media_partners' });

module.exports = MediaPartner;