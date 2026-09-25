const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Lead = sequelize.define('Lead', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  division: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  faculty: { 
    type: DataTypes.STRING 
  },
  photo_url: { 
    type: DataTypes.STRING 
  }
}, { 
  timestamps: true, 
  updatedAt: false, 
  tableName: 'leads' 
});

module.exports = Lead;