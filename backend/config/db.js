const { Sequelize } = require('sequelize');
require('dotenv').config();

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let sequelize;

if (connectionString) {
  // Jika menggunakan Connection String Vercel / Cloud DB
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' || connectionString.includes('sslmode=') 
        ? { require: true, rejectUnauthorized: false } 
        : false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Fallback untuk variabel terpisah (Lokal / Dev)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database PostgreSQL berhasil terhubung!');
  } catch (error) {
    console.error('Gagal terhubung ke database PostgreSQL:', error.message);
  }
};

module.exports = { sequelize, connectDB };