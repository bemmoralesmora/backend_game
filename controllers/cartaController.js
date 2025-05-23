const db = require("../db");

exports.getCartas = (req, res) => {
  db.query("SELECT * FROM Cartas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
