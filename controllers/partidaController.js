const db = require("../db");

exports.crearPartida = (req, res) => {
  const { fecha, tiempo, id_usuarios } = req.body;
  const sql =
    "INSERT INTO Partidas (fecha, tiempo, id_usuarios) VALUES (?, ?, ?)";
  db.query(sql, [fecha, tiempo, id_usuarios], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({
        message: "Partida guardada con éxito",
        id_partida: result.insertId,
      });
  });
};
