const db = require("../db");

exports.getCodigos = (req, res) => {
  db.query(
    "SELECT id_codigos, Codigos as codigo FROM Codigos",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
