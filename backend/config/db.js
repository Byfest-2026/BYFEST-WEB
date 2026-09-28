const { Sequelize } = require('sequelize');
require('dotenv').config();

// Prioritaskan Connection String (Neon/Vercel), gunakan fallback variabel terpisah jika tidak ada
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const sequelize = connectionString
  ? new Sequelize(connectionString, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Wajib untuk Neon PostgreSQL
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
      process.env.DB_NAME || process.env.PGDATABASE,
      process.env.DB_USER || process.env.PGUSER,
      process.env.DB_PASSWORD || process.env.PGPASSWORD,
      {
        host: process.env.DB_HOST || process.env.PGHOST,
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
    console.log('Koneksi ke database PostgreSQL (Neon) berhasil terhubung!');
  } catch (error) {
    console.error('Gagal terhubung ke database PostgreSQL:', error.message);
  }
};

module.exports = { sequelize, connectDB };