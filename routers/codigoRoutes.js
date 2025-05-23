const express = require("express");
const router = express.Router();
const { getCodigos } = require("../controllers/codigoController");

router.get("/", getCodigos);

module.exports = router;
