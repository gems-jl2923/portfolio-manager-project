const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'n3u3da!',
  database: 'portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
pool.getConnection()
  .then(conn => {
    console.log('MySQL 连接成功');
    conn.release();
  })
  .catch(err => {
    console.error('MySQL 连接失败:', err.message);
  });

module.exports = {pool};