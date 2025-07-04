const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "bdxffeko8k33g6gukerv-mysql.services.clever-cloud.com",
  user: "u9we5f5zffprspp0",
  password: "BKyj7I0WNNsasq5lLvRC",
  database: "bdxffeko8k33g6gukerv",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión al iniciar
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Conectado a MySQL (Pool)");
    connection.release();
  })
  .catch((err) => {
    console.error("Error al conectar a MySQL:", err.message);
  });

module.exports = pool;
