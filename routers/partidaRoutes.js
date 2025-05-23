const express = require("express");
const router = express.Router();
const { crearPartida } = require("../controllers/partidaController");

router.post("/", crearPartida);

module.exports = router;
