const express = require("express");
const router = express.Router();
const {
  crearPartida,
  validarPartida,
  guardarResultado,
  obtenerPodio,
  obtenerResultadosPorPartida,
} = require("../controllers/partidaController");

router.post("/", crearPartida);
router.get("/validar/:codigo", validarPartida);
router.post("/guardar-resultado", guardarResultado); // Nueva ruta
router.get("/podio/:id_partida", obtenerPodio); // Nueva ruta
router.get("/resultados/:id", obtenerResultadosPorPartida);

module.exports = router;
