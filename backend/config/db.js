const mysql = require('mysql2/promise');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'simrs_faceid',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Note: mysql2 does not accept keepAliveInitialDelayMs; keep options minimal
});

// Helper function to get connection
const getConnection = async () => {
  return await pool.getConnection();
};

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✓ Database connected successfully');
    connection.release();
  })
  .catch(error => {
    console.error('✗ Database connection failed:', error.message);
  });

module.exports = {
  pool,
  getConnection
};
// XAMPP MySQL