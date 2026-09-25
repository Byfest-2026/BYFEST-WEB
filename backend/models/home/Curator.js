const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Curator = sequelize.define('Curator', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT },
  photo_url: { type: DataTypes.STRING }
}, { timestamps: true, tableName: 'curators' });

module.exports = Curator;