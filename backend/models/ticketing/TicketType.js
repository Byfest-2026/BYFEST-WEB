const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const TicketType = sequelize.define('TicketType', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true, 
    allowNull: false 
  },
  program_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Null jika tiket bernilai 'pass' (multi-program)
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }, // contoh: "Program 1 Ticket", "Day 1 Pass", "3-Day All Pass"
  description: { 
    type: DataTypes.TEXT 
  },
  price: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    defaultValue: 0.00 
  },
  category: { 
    type: DataTypes.ENUM('single', 'pass'), 
    allowNull: false, 
    defaultValue: 'single' 
  }, // 'single' untuk 1 program, 'pass' untuk tiket terusan/multi-program
  quota: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
    defaultValue: 0 
  }, // Opsional / backup kuota jika diperlukan
  status: { 
    type: DataTypes.ENUM('active', 'inactive', 'sold_out'), 
    defaultValue: 'active' 
  }
}, { 
  timestamps: false, 
  tableName: 'ticket_types' 
});

module.exports = TicketType;