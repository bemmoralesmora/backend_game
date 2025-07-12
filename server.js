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
const pool = require("./db");

const app = express();
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: corsConfig.origin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/partidas", partidaRoutes);
app.use("/api/cartas", cartaRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/usuarios", userRoutes);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  socket.on("unirse_partida", async ({ codigoPartida, idLogin }) => {
    console.log("⚡️ Unirse a partida:", codigoPartida, idLogin);

    try {
      const [usuarios] = await pool.execute(
        "SELECT id_login, nombre FROM Login WHERE id_login = ?",
        [idLogin]
      );

      if (usuarios.length === 0) {
        socket.emit("error_partida", {
          mensaje: "Usuario no encontrado",
          codigo: "USER_NOT_FOUND",
        });
        return;
      }

      const nombreJugador = usuarios[0].nombre;

      const [partidas] = await pool.execute(
        "SELECT * FROM Partidas WHERE codigo_generado = ?",
        [codigoPartida]
      );

      if (partidas.length === 0) {
        socket.emit("error_partida", { mensaje: "Partida no encontrada" });
        return;
      }

      const partida = partidas[0];

      if (partida.estado !== "esperando") {
        socket.emit("error_partida", {
          mensaje:
            partida.estado === "comenzado"
              ? "La partida ya ha comenzado"
              : "La partida ha finalizado",
        });
        return;
      }

      const [jugadorExistente] = await pool.execute(
        "SELECT * FROM Jugadores_Partida WHERE id_partida = ? AND id_login = ?",
        [partida.id_partidas, idLogin]
      );

      if (jugadorExistente.length > 0) {
        socket.emit("error_partida", { mensaje: "Ya estás en esta partida" });
        return;
      }

      socket.join(`partida_${partida.id_partidas}`);

      await pool.execute(
        "INSERT INTO Jugadores_Partida (id_partida, id_login, nombre_jugador, socket_id) VALUES (?, ?, ?, ?)",
        [partida.id_partidas, idLogin, nombreJugador, socket.id]
      );

      const [jugadores] = await pool.execute(
        "SELECT nombre_jugador FROM Jugadores_Partida WHERE id_partida = ?",
        [partida.id_partidas]
      );

      io.to(`partida_${partida.id_partidas}`).emit("actualizar_jugadores", {
        jugadoresConectados: jugadores.length,
        jugadoresRequeridos: partida.numero_jugadores,
        listaJugadores: jugadores.map((j) => j.nombre_jugador),
        idPartida: partida.id_partidas,
        nombrePartida: partida.nombre_partida,
        nivel: partida.numero_nivel,
        dificultad: partida.dificultad,
      });
    } catch (error) {
      console.error("Error al unirse a partida:", error);
      socket.emit("error_partida", {
        mensaje: "Error interno del servidor",
        codigo: "INTERNAL_ERROR",
      });
    }
  });

  socket.on("comenzar_partida", async ({ idPartida, idLogin }) => {
    try {
      const [partidas] = await pool.execute(
        "SELECT * FROM Partidas WHERE id_partidas = ? AND id_usuarios = ?",
        [idPartida, idLogin]
      );

      if (partidas.length === 0) {
        socket.emit("error_partida", {
          mensaje: "No tienes permiso para iniciar esta partida",
        });
        return;
      }

      await pool.execute(
        "UPDATE Partidas SET estado = 'comenzado' WHERE id_partidas = ?",
        [idPartida]
      );

      io.to(`partida_${idPartida}`).emit("partida_comenzada", {
        idPartida,
        mensaje: "La partida ha comenzado",
        nivel: partidas[0].numero_nivel,
        dificultad: partidas[0].dificultad,
      });
    } catch (error) {
      console.error("Error al comenzar la partida:", error);
      socket.emit("error_partida", {
        mensaje: "Error al intentar comenzar la partida",
        codigo: "INTERNAL_ERROR",
      });
    }
  });

  socket.on("disconnect", async () => {
    console.log("Cliente desconectado:", socket.id);

    try {
      const [jugador] = await pool.execute(
        "SELECT id_partida FROM Jugadores_Partida WHERE socket_id = ?",
        [socket.id]
      );

      if (jugador.length > 0) {
        const idPartida = jugador[0].id_partida;

        await pool.execute(
          "DELETE FROM Jugadores_Partida WHERE socket_id = ?",
          [socket.id]
        );

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
