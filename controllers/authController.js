const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { nombre, contraseña, correo } = req.body;

  if (!nombre || !contraseña || !correo) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    const hash = bcrypt.hashSync(contraseña, 8);
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [registroResult] = await connection.execute(
        "INSERT INTO Registro (nombre, contraseña, correo) VALUES (?, ?, ?)",
        [nombre, hash, correo]
      );

      const idRegistro = registroResult.insertId;

      await connection.execute(
        "INSERT INTO Login (nombre, contraseña, id_registro) VALUES (?, ?, ?)",
        [nombre, hash, idRegistro]
      );

      await connection.commit();
      connection.release();

      res.status(201).json({
        message: "Usuario registrado con éxito",
        id: idRegistro,
      });
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({
      error: err.message,
      details: "Error al registrar usuario. Verifique credenciales.",
    });
  }
};

exports.login = async (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res
      .status(400)
      .json({ message: "Nombre y contraseña son requeridos" });
  }

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      `SELECT r.id_registro, r.nombre, r.correo, l.id_login, l.contraseña 
       FROM Registro r JOIN Login l ON r.id_registro = l.id_registro
       WHERE r.nombre = ? OR r.correo = ?`,
      [nombre, nombre]
    );

    if (
      results.length === 0 ||
      !bcrypt.compareSync(contraseña, results[0].contraseña)
    ) {
      connection.release();
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = results[0];
    const token = jwt.sign(
      { id: user.id_registro, nombre: user.nombre, correo: user.correo },
      "secreto",
      { expiresIn: "1h" }
    );

    // ✅ Aquí guardamos el token en la BD
    await connection.execute(`UPDATE Login SET token = ? WHERE id_login = ?`, [
      token,
      user.id_login,
    ]);

    connection.release();

    res.json({
      message: "Login exitoso",
      id_usuario: user.id_login,
      token,
      nombre: user.nombre,
      correo: user.correo,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: err.message });
  }
};
