const mysql = require('mysql2');

// Koneksi Database MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'smartposyandu',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Koneksi MySQL gagal:', err.message);
  } else {
    console.log('✅ Sukses terhubung ke database MySQL smartposyandu.');
    connection.release();
  }
});

const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = {
  db,
  queryAsync
};
