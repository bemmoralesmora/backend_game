/* const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Configuración de la conexión a la base de datos
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

// Inicialización del servidor
const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------------------
// RUTA: REGISTER (Simplificada)
// ------------------------------------------
app.post("/register", async (req, res) => {
  const { nombre, contraseña, correo } = req.body;

  if (!nombre || !contraseña || !correo) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const hash = bcrypt.hashSync(contraseña, 8);
    const connection = await pool.getConnection();

    // Iniciamos transacción
    await connection.beginTransaction();

    try {
      // Paso 1: insertar en Registro (con todos los campos necesarios)
      const [registroResult] = await connection.execute(
        "INSERT INTO Registro (nombre, contraseña, correo) VALUES (?, ?, ?)",
        [nombre, hash, correo]
      );

      const idRegistro = registroResult.insertId;

      // Paso 2: insertar en Login (solo lo esencial)
      await connection.execute(
        "INSERT INTO Login (nombre, contraseña, id_registro) VALUES (?, ?, ?)",
        [nombre, hash, idRegistro]
      );

      // Confirmamos la transacción
      await connection.commit();
      connection.release();

      res.status(201).json({
        message: "Usuario registrado con éxito",
        id: idRegistro,
      });
    } catch (err) {
      // Si hay error, hacemos rollback
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({
      error: err.message,
      details:
        "Error al registrar usuario. Verifique que el correo o nombre no estén en uso.",
    });
  }
});

// ------------------------------------------
// RUTA: LOGIN (Simplificada)
// ------------------------------------------
app.post("/login", async (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res
      .status(400)
      .json({ message: "Nombre y contraseña son requeridos" });
  }

  try {
    const connection = await pool.getConnection();

    const [results] = await connection.execute(
      `
      SELECT r.id_registro, r.nombre, r.correo, l.contraseña 
      FROM Registro r
      JOIN Login l ON r.id_registro = l.id_registro
      WHERE r.nombre = ? OR r.correo = ?
    `,
      [nombre, nombre]
    );

    connection.release();

    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = results[0];
    const isValid = bcrypt.compareSync(contraseña, user.contraseña);

    if (!isValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      {
        id: user.id_registro,
        nombre: user.nombre,
        correo: user.correo,
      },
      "secreto",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      id_usuario: user.id_registro,
      token,
      nombre: user.nombre,
      correo: user.correo,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------
// Guardar partidas

app.post("/api/partidas", async (req, res) => {
  try {
    const { nombre_partida, numero_jugadores, numero_nivel, codigo_generado } =
      req.body;

    // Validación básica de datos
    if (
      !nombre_partida ||
      !numero_jugadores ||
      !numero_nivel ||
      !codigo_generado
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Insertar en la base de datos
    const [result] = await pool.execute(
      "INSERT INTO Partidas (nombre_partida, numero_jugadores, numero_nivel, codigo_generado) VALUES (?, ?, ?, ?)",
      [nombre_partida, numero_jugadores, numero_nivel, codigo_generado]
    );

    res.status(201).json({
      success: true,
      message: "Partida guardada exitosamente",
      id_partida: result.insertId,
    });
  } catch (error) {
    console.error("Error al guardar partida:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Añade esta nueva ruta en tu backend (app.js o server.js)
app.get("/api/partidas/validar/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    // Buscar partida en la base de datos
    const [partidas] = await pool.execute(
      "SELECT * FROM Partidas WHERE codigo_generado = ?",
      [codigo]
    );

    if (partidas.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Partida no encontrada",
      });
    }

    const partida = partidas[0];

    res.json({
      success: true,
      partida: {
        id: partida.id_partidas,
        nombre: partida.nombre_partida,
        jugadores: partida.numero_jugadores,
        nivel: partida.numero_nivel,
        codigo: partida.codigo_generado,
      },
    });
  } catch (error) {
    console.error("Error al validar partida:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// ------------------------------------------
// INICIAR SERVIDOR
// ------------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
 */
