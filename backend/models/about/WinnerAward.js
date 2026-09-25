const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const WinnerAward = sequelize.define('WinnerAward', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  year: { 
    type: DataTypes.INTEGER, 
    allowNull: false
  },
  category: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  film: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  person: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  instansi: { 
    type: DataTypes.STRING, 
    allowNull: true 
  },
  image: { 
    type: DataTypes.STRING, 
    allowNull: true 
  }
}, { 
  timestamps: true, 
  updatedAt: false, 
  tableName: 'winner_awards' 
});

module.exports = WinnerAward;