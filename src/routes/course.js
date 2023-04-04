const express = require("express");
const routes = express.Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const horaActual = require("../config/date");
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

routes.post("/addNewCourse", async (req, res) => {
  try {
    /*algoritmo para almacenar un curso
    -recuperar el id del token
    -recuperar el objeto curso
    -si todo sale bien enviar un status 200 y un mensaje de confirmacion de registro de curso para mostrarlo en el frontend
    */

    const { data, nuevamntToken } = req.body;
    let id;
    if (nuevamntToken !== undefined) {
      jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
        err ? res.status(401).json() : (id = decoded.id);
      });
      const courseObject = {
        nombre_curso: data.titulo_curso,
        slug_curso: data.slug_curso,
        descripcion_curso: data.descripcion_curso,
        categoria_curso: data.categoria_curso,
        precio_curso: data.precio_curso,
        que_aprendere_curso: data.que_aprendere_curso,
        publico_objetivo_curso: data.publico_objetivo_curso,
        duracion_horas_curso: data.duracion_horas_curso,
        duracion_minutos_curso: data.duracion_minutos_curso,
        materiales_incluidos_curso: data.materiales_incluidos_curso,
        etiquetas_curso: data.etiquetas_curso,
        precio_curso: data.precio_curso,
        fecha_registro_curso: new Date(horaActual),
        calificacion_curso: 0,
        thumbnail_curso: data.thumbnail_curso,
        fk_id_categoria_curso: data.fk_id_categoria_curso,
        /*aclarar la parte de tipo de pago */
      };
      res.json({
        status: 200,
        message: "curso agregado correctamente",
      });
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
});
routes.get("/getAllCoursesToBuy", async (req, res) => {
  try {
    const getAllCoursesToBuy = await prisma.tb_curso.findMany({
      include: {
        tb_usuario: true,
      },
    });
    res.json({ getAllCoursesToBuy: getAllCoursesToBuy });
  } catch (error) {
    console.log(error);
  }
});
/*metodo para listar todos los cursos*/
module.exports = routes;
