const express = require("express");
const router = express.Router();

// importar el controllador
const proyectosControllers = require("../controllers/proyectosControllers");

module.exports = function () {
  // ruta para el home
  router.get("/", proyectosControllers.proyectosHome);

  return router;
};
