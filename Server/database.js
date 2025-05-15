require('dotenv').config();
const mysql = require('mysql2');

let connection;

try {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  connection.connect((err) => {
    if (err) {
      console.error('❌ Error de conexión a MySQL:', err.message);
    } else {
      console.log(`✅ Conectado a MySQL en host "${process.env.DB_HOST}"`);
    }
  });

} catch (err) {
  console.error('❌ Excepción al conectar a MySQL:', err.message);
}

module.exports = connection;
