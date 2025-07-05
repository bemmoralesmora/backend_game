const pool = require("../db");

exports.crearPartida = async (req, res) => {
  const {
    nombre_partida,
    numero_jugadores,
    numero_nivel,
    codigo_generado,
    dificultad,
    tipo_partida = "publica",
    estado = "esperando",
    id_usuarios = null,
  } = req.body;

  // Campos obligatorios
  if (
    !nombre_partida ||
    !numero_jugadores ||
    !numero_nivel ||
    !codigo_generado ||
    !dificultad
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  // Validar valores de enum
  const dificultadesValidas = ["facil", "intermedio", "dificil"];
  const tiposPartidaValidos = ["publica", "privada"];
  const estadosValidos = ["esperando", "comenzado", "finalizada"];

  if (!dificultadesValidas.includes(dificultad)) {
    return res.status(400).json({ error: "Dificultad no válida" });
  }

  if (tipo_partida && !tiposPartidaValidos.includes(tipo_partida)) {
    return res.status(400).json({ error: "Tipo de partida no válido" });
  }

  if (estado && !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado no válido" });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO Partidas (
        nombre_partida, 
        numero_jugadores, 
        numero_nivel, 
        codigo_generado,
        dificultad,
        tipo_partida,
        estado,
        id_usuarios
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_partida,
        numero_jugadores,
        numero_nivel,
        codigo_generado,
        dificultad,
        tipo_partida,
        estado,
        id_usuarios,
      ]
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
      `SELECT 
        id_partidas,
        nombre_partida,
        numero_jugadores,
        numero_nivel,
        codigo_generado,
        dificultad,
        tipo_partida,
        estado,
        id_usuarios
      FROM Partidas WHERE codigo_generado = ?`,
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
        dificultad: partida.dificultad,
        tipo: partida.tipo_partida,
        estado: partida.estado,
        creador: partida.id_usuarios,
      },
    });
  } catch (error) {
    console.error("Error al validar partida:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};
