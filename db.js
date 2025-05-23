const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "coldwinter.123",
  database: "playgroud",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err.message);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

module.exports = db;
