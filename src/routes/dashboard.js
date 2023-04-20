const express = require("express");
const routes = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

routes.get("/getDashboardData", async (req, res) => {
  try {
    /*
--cantidad de cursos comprados por usuario
--cantidad de cursos completados por usuario
--cursos inscritos por usuario con un campo de progreso calculado

*/
  } catch (error) {}
});

/*metodo para listar todos los cursos*/
module.exports = routes;
