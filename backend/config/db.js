const { Sequelize } = require('sequelize');
require('dotenv').config();

// Menggunakan connection string jika ada (bawaan Vercel), jika tidak ada baru gunakan variabel terpisah
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const sequelize = connectionString
  ? new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Menghindari error sertifikat SSL pada cloud DB
        }
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize(
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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database PostgreSQL berhasil terhubung!');
  } catch (error) {
    console.error('Gagal terhubung ke database PostgreSQL:', error.message);
  }
};

module.exports = { sequelize, connectDB };