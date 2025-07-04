const pool = require("../db");

exports.crearPartida = async (req, res) => {
  const { nombre_partida, numero_jugadores, numero_nivel, codigo_generado } =
    req.body;

  if (
    !nombre_partida ||
    !numero_jugadores ||
    !numero_nivel ||
    !codigo_generado
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  try {
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
};

exports.validarPartida = async (req, res) => {
  try {
    const { codigo } = req.params;
    const [partidas] = await pool.execute(
      "SELECT * FROM Partidas WHERE codigo_generado = ?",
      [codigo]
    );

    if (partidas.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Partida no encontrada" });
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
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};
