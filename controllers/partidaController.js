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
    nombre_juego,
  } = req.body;

  console.log("Datos recibidos:", req.body); // Para depuración

  try {
    const [result] = await pool.execute(
      `INSERT INTO Partidas (
        nombre_partida, numero_jugadores, numero_nivel, 
        codigo_generado, dificultad, tipo_partida, estado, id_usuarios, nombre_juego
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_partida,
        parseInt(numero_jugadores), // Asegurar que es número
        parseInt(numero_nivel), // Asegurar que es número
        codigo_generado,
        dificultad,
        tipo_partida,
        estado,
        id_usuarios,
        nombre_juego,
      ]
    );

    console.log("Resultado de inserción:", result);

    res.status(201).json({
      success: true,
      message: "Partida creada exitosamente",
      id_partida: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear partida:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear partida",
      error: error.message,
    });
  }
};

exports.validarPartida = async (req, res) => {
  try {
    const { codigo } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de autenticación requerido",
      });
    }

    // Verificar el token y obtener el usuario
    const [user] = await pool.execute(
      "SELECT id_login FROM Login WHERE token = ?",
      [token]
    );

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const [partidas] = await pool.execute(
      `SELECT 
        id_partidas as id,
        nombre_partida as nombre,
        numero_jugadores as jugadores,
        numero_nivel as nivel,
        codigo_generado as codigo,
        dificultad,
        tipo_partida as tipo,
        estado,
        id_usuarios as creador,
        nombre_juego
      FROM Partidas WHERE codigo_generado = ?`,
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
      partida,
      userId: user[0].id_login, // Incluir el ID del usuario en la respuesta
    });
  } catch (error) {
    console.error("Error al validar partida:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

exports.guardarResultado = async (req, res) => {
  const { id_partida, id_login, puntos_obtenidos } = req.body;

  try {
    const [resultado] = await pool.execute(
      `INSERT INTO ResultadosPartida (id_partida, id_login, puntos_obtenidos)
       VALUES (?, ?, ?)`,
      [id_partida, id_login, puntos_obtenidos]
    );

    res.status(201).json({
      success: true,
      message: "Puntos guardados exitosamente",
    });
  } catch (error) {
    console.error("Error al guardar resultado:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar resultado",
      error: error.message,
    });
  }
};

exports.obtenerPodio = async (req, res) => {
  const { id_partida } = req.params;

  try {
    const [resultados] = await pool.execute(
      `SELECT L.nombre, R.puntos_obtenidos
       FROM ResultadosPartida R
       JOIN Login L ON R.id_login = L.id_login
       WHERE R.id_partida = ?
       ORDER BY R.puntos_obtenidos DESC
       LIMIT 5`,
      [id_partida]
    );

    res.json({
      success: true,
      podio: resultados,
    });
  } catch (error) {
    console.error("Error al obtener podio:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener podio",
    });
  }
};

exports.obtenerResultadosPorPartida = async (req, res) => {
  const { id } = req.params; // id_partida recibido como parámetro

  try {
    const [resultados] = await pool.execute(
      `
      SELECT r.*, l.nombre 
      FROM ResultadosPartida r
      JOIN Login l ON r.id_login = l.id_login
      WHERE r.id_partida = ?
      ORDER BY r.puntos_obtenidos DESC
      `,
      [id]
    );

    res.json({
      success: true,
      resultados,
    });
  } catch (error) {
    console.error("Error al obtener resultados por partida:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener resultados de la partida",
    });
  }
};
