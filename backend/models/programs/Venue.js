const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Venue = sequelize.define('Venue', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT },
  capacity: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false, tableName: 'venues' });

module.exports = Venue;