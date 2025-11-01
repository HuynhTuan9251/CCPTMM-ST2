const sql = require('mssql');
const logger = require('../utils/logger');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: true,
  },
};

let pool = null;

const connectDB = async () => {
  try {
    pool = await sql.connect(dbConfig);
    logger.info('Connected to SQL Server');
    return pool;
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return pool;
};

const closeDB = async () => {
  if (pool) {
    await pool.close();
    logger.info('Database connection closed');
  }
};

module.exports = {
  connectDB,
  getPool,
  closeDB,
  dbConfig
}; 