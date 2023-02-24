const express = require("express");
const routes = express.Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

/*metodo para agregar un curso por un docente*/
routes.post("/registerNewCourse", async (req, res) => {
  try {
    const courseData = {
      nombre_curso: req.body.nombre_curso,
      descripcion_curso: req.body.descripcion_curso,
      precio_curso: req.body.precio_curso,
      url_imagen_principal_curso: req.body.url_imagen_principal_curso,
      url_imagen_banner_curso: req.body.url_imagen_banner_curso,
      fk_id_categoria_curso: 1,
      fk_id_usuario_curso: 86,
      fk_id_modalidad_curso: 1,
    };
    await prisma.tb_curso.create({
      data: {
        nombre_curso: courseData.nombre_curso,
        descripcion_curso: courseData.descripcion_curso,
        precio_curso: courseData.precio_curso,
        url_imagen_principal_curso: courseData.url_imagen_principal_curso,
        url_imagen_banner_curso: courseData.url_imagen_banner_curso,
        fk_id_categoria_curso: courseData.fk_id_categoria_curso,
        fk_id_usuario_curso: courseData.fk_id_usuario_curso,
        fk_id_modalidad_curso_curso: courseData.fk_id_modalidad_curso_curso,
      },
    });
    res.json({
      status: 200,
      message: "curso agregado correctamente",
    });
    //agregar validaciones de longitudes llenas
  } catch (error) {
    console.log(error);
  }
});

/*metodo para listar todos los cursos*/
module.exports = routes;
