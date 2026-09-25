const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Sponsorship = sequelize.define('Sponsorship', {
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
    type: DataTypes.TEXT, 
  }
}, { timestamps: true, updatedAt: false, tableName: 'sponsorships' });

module.exports = Sponsorship;