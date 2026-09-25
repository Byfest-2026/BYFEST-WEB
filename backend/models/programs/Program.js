const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Program = sequelize.define('Program', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true, 
    allowNull: false 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  slug: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false 
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  date: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  start_time: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  end_time: { 
    type: DataTypes.TIME, 
    allowNull: false 
  },
  age_rating: { 
    type: DataTypes.STRING 
  },
  quota: { 
    type: DataTypes.INTEGER, 
    allowNull: false
  } // Kapasitas kursi venue/studio per program
}, { 
  timestamps: true, 
  tableName: 'programs' 
});

module.exports = Program;