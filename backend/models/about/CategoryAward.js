const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const CategoryAward = sequelize.define('CategoryAward', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  }
}, { 
  timestamps: false, 
  tableName: 'category_awards' 
});

module.exports = CategoryAward;