const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');


const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    autoIncrementIdentity: true,
  },
  order_code: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  buyer_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // Menyimpan ringkasan tiket yang dibeli (bisa berupa teks atau stringified JSON)
  tickets_summary: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  payment_proof: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'rejected', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  tableName: 'orders',
});

module.exports = Order;