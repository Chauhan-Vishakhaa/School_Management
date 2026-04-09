require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user:'root',
  password: process.env.db_password,
  database:'School_Management'
});

const promisePool = pool.promise();


promisePool.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

module.exports = promisePool;