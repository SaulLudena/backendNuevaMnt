const express = require("express");
const routes = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*ruta para obtener todas las categorias de cursos */
routes.get("/getAllCategories", async (req, res) => {
  try {
    const getAllCategories = await prisma.tb_categoria_curso.findMany();
    res.json({ getAllCategories: getAllCategories });
  } catch (error) {
    console.log(error);
  }
});

/*ruta para actualizar una categoria por id*/
routes.put("/updateCategory", async (req, res) => {
  try {
    const { id_categoria, nombre_categoria } = req.body;
    const updateCategory = await prisma.tb_categoria_curso.update({
      where: {
        id_categoria: id_categoria,
      },
      data: {
        nombre_categoria: nombre_categoria,
      },
    });
    res.json({ updateCategory: updateCategory });
  } catch (error) {
    console.log(error);
  }
});

/*ruta para agregar una nueva categoria */
routes.post("/addCategory", async (req, res) => {
  try {
    const { nombre_categoria } = req.body;
    const addCategory = await prisma.tb_categoria_curso.create({
      data: {
        nombre_categoria: nombre_categoria,
      },
    });
    res.json({ addCategory: addCategory });
  } catch (error) {
    console.log(error);
  }
});

module.exports = routes;
