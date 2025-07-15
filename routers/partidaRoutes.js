const express = require("express");
const router = express.Router();
const {
  crearPartida,
  validarPartida,
  guardarResultado,
  obtenerPodio,
} = require("../controllers/partidaController");

router.post("/", crearPartida);
router.get("/validar/:codigo", validarPartida);
router.post("/guardar-resultado", guardarResultado); // Nueva ruta
router.get("/podio/:id_partida", obtenerPodio); // Nueva ruta

module.exports = router;
