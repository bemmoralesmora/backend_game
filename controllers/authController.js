const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { nombre, contraseña, correo } = req.body;
  const hash = bcrypt.hashSync(contraseña, 8);

  const sql =
    "INSERT INTO Registro (nombre, contraseña, correo) VALUES (?, ?, ?)";
  db.query(sql, [nombre, hash, correo], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Usuario registrado con éxito", id: result.insertId });
  });
};

exports.login = (req, res) => {
  const { nombre, contraseña } = req.body;

  // Validación básica
  if (!nombre || !contraseña) {
    return res
      .status(400)
      .json({ message: "Nombre y contraseña son requeridos" });
  }

  // Consulta modificada para tu estructura de DB
  const sql = `
    SELECT r.id_registro, r.nombre, r.correo, l.contraseña 
    FROM Registro r
    JOIN Login l ON r.id_registro = l.id_registro
    WHERE r.nombre = ? OR r.correo = ?
  `;

  db.query(sql, [nombre, nombre], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const user = results[0];
    const isValid = bcrypt.compareSync(contraseña, user.contraseña);
    if (!isValid) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ id: user.id_registro }, "secreto", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login exitoso",
      id_usuario: user.id_registro,
      token,
      nombre: user.nombre,
      correo: user.correo,
    });
  });
};
