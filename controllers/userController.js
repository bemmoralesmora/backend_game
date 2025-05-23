const db = require("../db");

exports.getUsuario = (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT id_registro as id, nombre FROM Registro WHERE id_registro = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const user = results[0];
      db.query(
        "SELECT puntos FROM Estadisticas WHERE nombre = ?",
        [user.nombre],
        (err2, result2) => {
          const puntos = result2.length > 0 ? result2[0].puntos : 0;
          res.json({ ...user, puntos });
        }
      );
    }
  );
};

exports.getEstadisticas = (req, res) => {
  const { id_usuario } = req.params;
  db.query(
    "SELECT e.id_estadisticas, e.nombre, e.puntos FROM Estadisticas e JOIN Registro r ON e.nombre = r.nombre WHERE r.id_registro = ?",
    [id_usuario],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Estadísticas no encontradas" });
      res.json(results[0]);
    }
  );
};
