const pool = require("../db");

exports.getUsuario = (req, res) => {
  const { id } = req.params;

  // Obtener datos básicos del perfil
  const queryPerfil = `
    SELECT 
      ul.id_login AS id,
      ul.nombre,
      ul.descripcion,
      ul.seguidores,
      ul.imagen_perfil,
      e.puntos,
      e.victorias,
      e.derrotas,
      e.total_partidas
    FROM UsuariosLogin ul
    LEFT JOIN Estadisticas e ON ul.id_estadisticas = e.id_estadisticas
    WHERE ul.id_login = ?
  `;

  pool.query(queryPerfil, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json(results[0]);
  });
};

exports.getEstadisticas = (req, res) => {
  const { id_usuario } = req.params;

  const query = `
    SELECT 
      e.id_estadisticas,
      e.puntos,
      e.victorias,
      e.derrotas,
      e.total_partidas
    FROM Estadisticas e
    JOIN UsuariosLogin ul ON e.id_estadisticas = ul.id_estadisticas
    WHERE ul.id_login = ?
  `;

  pool.query(query, [id_usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Estadísticas no encontradas" });

    res.json(results[0]);
  });
};

// Obtener logros del usuario
exports.getLogros = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      id_logro,
      nombre_logro,
      descripcion_logro,
      fecha_obtenido
    FROM Logros
    WHERE id_login = ?
    ORDER BY fecha_obtenido DESC
  `;

  pool.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results); // puede devolver lista vacía si no hay logros
  });
};

// Obtener las últimas partidas del usuario
exports.getPartidas = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      id_partida,
      nombre_partida,
      numero_jugadores,
      numero_nivel,
      dificultad,
      tipo_partida,
      estado
    FROM Partidas
    WHERE id_usuarios = ?
    ORDER BY id_partida DESC
    LIMIT 10
  `;

  pool.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
