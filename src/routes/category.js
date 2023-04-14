const express = require("express");
const routes = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

routes.get("/getAllCategories", async (req, res) => {
  try {
    const getAllCategories = await prisma.tb_categoria_curso.findMany();
    res.json({ getAllCategories: getAllCategories });
  } catch (error) {
    console.log(error);
  }
});

/*metodo para listar todos los cursos*/
module.exports = routes;
