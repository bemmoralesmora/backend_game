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

  console.log("Datos recibidos:", req.body); // Para depuración

  try {
    const [result] = await pool.execute(
      `INSERT INTO Partidas (
        nombre_partida, numero_jugadores, numero_nivel, 
        codigo_generado, dificultad, tipo_partida, estado, id_usuarios
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre_partida,
        parseInt(numero_jugadores), // Asegurar que es número
        parseInt(numero_nivel), // Asegurar que es número
        codigo_generado,
        dificultad,
        tipo_partida,
        estado,
        id_usuarios,
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
        id_usuarios as creador
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
