const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const corsConfig = require("./corsConfig");

const authRoutes = require("./routers/authRoutes");
const partidaRoutes = require("./routers/partidaRoutes");
const cartaRoutes = require("./routers/cartaRoutes");
const codigoRoutes = require("./routers/codigoRoutes");
const userRoutes = require("./routers/userRoutes");
const pool = require("./db"); // Asegúrate de importar tu pool de conexiones

const app = express();
const server = http.createServer(app);

// Configuración de Socket.io con CORS
const io = socketio(server, {
  cors: {
    origin: corsConfig.origin, // Usa la misma configuración CORS
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors(corsConfig));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/partidas", partidaRoutes);
app.use("/api/cartas", cartaRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/usuarios", userRoutes);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  // Unirse a una sala de partida
  console.log("Datos recibidos para unirse_partida:", {
    codigoPartida,
    idLogin,
  });
  socket.on("unirse_partida", async ({ codigoPartida, idLogin }) => {
    try {
      // Obtener información del usuario
      const [usuarios] = await pool.execute(
        "SELECT id_login, nombre FROM Login WHERE id_login = ?",
        [idLogin] //
      );

      if (usuarios.length === 0) {
        socket.emit("error_partida", {
          mensaje: "Usuario no encontrado",
          codigo: "USER_NOT_FOUND",
        });
        return;
      }

      const nombreJugador = usuarios[0].nombre;

      // Verificar la partida
      const [partidas] = await pool.execute(
        "SELECT * FROM Partidas WHERE codigo_generado = ?",
        [codigoPartida]
      );

      if (partidas.length === 0) {
        socket.emit("error_partida", { mensaje: "Partida no encontrada" });
        return;
      }

      const partida = partidas[0];

      // Verificar si la partida ya comenzó
      if (partida.estado !== "esperando") {
        socket.emit("error_partida", {
          mensaje:
            partida.estado === "comenzado"
              ? "La partida ya ha comenzado"
              : "La partida ha finalizado",
        });
        return;
      }

      // Verificar si el usuario ya está en la partida
      const [jugadorExistente] = await pool.execute(
        "SELECT * FROM Jugadores_Partida WHERE id_partida = ? AND id_login = ?",
        [partida.id_partidas, idLogin]
      );

      if (jugadorExistente.length > 0) {
        socket.emit("error_partida", { mensaje: "Ya estás en esta partida" });
        return;
      }

      // Unirse a la sala (room) específica de la partida
      socket.join(`partida_${partida.id_partidas}`);

      // Registrar al jugador en la base de datos
      await pool.execute(
        "INSERT INTO Jugadores_Partida (id_partida, id_login, nombre_jugador, socket_id) VALUES (?, ?, ?, ?)",
        [partida.id_partidas, idLogin, nombreJugador, socket.id]
      );

      // Obtener lista completa de jugadores conectados
      const [jugadores] = await pool.execute(
        "SELECT nombre_jugador FROM Jugadores_Partida WHERE id_partida = ?",
        [partida.id_partidas]
      );

      const jugadoresConectados = jugadores.length;

      // Notificar a todos en la partida
      io.to(`partida_${partida.id_partidas}`).emit("actualizar_jugadores", {
        jugadoresConectados: jugadores.length,
        jugadoresRequeridos: partida.numero_jugadores,
        listaJugadores: jugadores.map((j) => j.nombre_jugador),
        idPartida: partida.id_partidas,
        nombrePartida: partida.nombre_partida,
        nivel: partida.numero_nivel,
        dificultad: partida.dificultad,
      });

      // Verificar si se completó el número de jugadores
      if (jugadoresConectados >= partida.numero_jugadores) {
        io.to(`partida_${partida.id_partidas}`).emit("partida_lista", {
          idPartida: partida.id_partidas,
          nivel: partida.numero_nivel,
          dificultad: partida.dificultad,
          jugadores: jugadores.map((j) => j.nombre_jugador),
        });

        // Actualizar estado de la partida
        await pool.execute(
          "UPDATE Partidas SET estado = 'comenzado' WHERE id_partidas = ?",
          [partida.id_partidas]
        );
      }
    } catch (error) {
      console.error("Error al unirse a partida:", error);
      socket.emit("error_partida", {
        mensaje: "Error interno del servidor",
        codigo: "INTERNAL_ERROR",
      });
    }
  });

  // Manejar desconexión
  socket.on("disconnect", async () => {
    console.log("Cliente desconectado:", socket.id);
    try {
      // Obtener información de la partida antes de eliminar al jugador
      const [jugador] = await pool.execute(
        "SELECT id_partida FROM Jugadores_Partida WHERE socket_id = ?",
        [socket.id]
      );

      if (jugador.length > 0) {
        const idPartida = jugador[0].id_partida;

        // Eliminar jugador de la partida
        await pool.execute(
          "DELETE FROM Jugadores_Partida WHERE socket_id = ?",
          [socket.id]
        );

        // Notificar a los demás jugadores
        const [jugadoresRestantes] = await pool.execute(
          "SELECT nombre_jugador FROM Jugadores_Partida WHERE id_partida = ?",
          [idPartida]
        );

        const [partida] = await pool.execute(
          "SELECT numero_jugadores FROM Partidas WHERE id_partidas = ?",
          [idPartida]
        );

        if (partida.length > 0) {
          io.to(`partida_${idPartida}`).emit("actualizar_jugadores", {
            jugadoresConectados: jugadoresRestantes.length,
            jugadoresRequeridos: partida[0].numero_jugadores,
            listaJugadores: jugadoresRestantes.map((j) => j.nombre_jugador),
            idPartida: idPartida,
          });
        }
      }
    } catch (error) {
      console.error("Error al manejar desconexión:", error);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
