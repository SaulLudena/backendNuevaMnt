const express = require("express");
const routes = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const horaActual = require("../config/date");
const crypto = require("crypto");

/*metodo para agregar un curso por un docente*/
routes.post("/addNewCourse", async (req, res) => {
  try {
    /*recuperamos el curso y el token del administrador o docente */
    const { data, nuevamntToken } = req.body;
    /*variable para almacenar el id del administrador o el docente */
    let id_user;
    console.log(data);
    /*verificamos que haya un token para agregar un curso */
    if (nuevamntToken !== undefined) {
      jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
        err ? res.status(401).json() : (id_user = decoded.id);
      });
      /*construimos un objeto que guarda los id's de curso, modulo y leccion */
      const ids = {
        id_curso: crypto.randomInt(0, 2000),
        id_modulo: crypto.randomInt(0, 2000),
      };

      await prisma.tb_curso.create({
        data: {
          id_curso: ids.id_curso,
          nombre_curso: data.titulo_curso,
          slug_curso: data.slug_curso,
          descripcion_curso: data.descripcion_curso,
          tipo_precio_curso: data.tipo_precio_curso,
          precio_regular_curso: parseInt(data.precio_regular_curso) || 0,
          precio_descuento_curso: parseInt(data.precio_descuento_curso) || 0,
          que_aprendere_curso: data.que_aprendere_curso || "",
          publico_objetivo_curso: data.publico_objetivo_curso || "",
          duracion_horas_curso: parseInt(data.duracion_horas_curso) || 0,
          duracion_minutos_curso: parseInt(data.duracion_minutos_curso) || 0,
          materiales_incluidos_curso: data.materiales_incluidos_curso || "",
          etiquetas_curso: data.etiquetas_curso || "",
          fecha_registro_curso: new Date(horaActual) || "",
          calificacion_curso: 0 || 0,
          url_imagen_principal_curso: "",
          tb_categoria_curso: {
            connect: {
              id_categoria_curso: parseInt(data.categoria_curso),
            },
          },
          tb_usuario: {
            connect: {
              id_usuario: id_user,
            },
          },
        },
      });

      if (data.modulos_curso !== undefined) {
        await prisma.tb_modulo.createMany({
          data: data.modulos_curso.map((modulo) => {
            console.log(modulo);
            return {
              id_modulo: ids.id_modulo,
              nombre_modulo: modulo.moduleName,
              resumen_modulo: modulo.moduleDescription,
              fk_id_curso: ids.id_curso,
              fecha_registro_modulo: new Date(horaActual),
            };
          }),
        });
      }

      res.json({
        status: 200,
        message: "Curso agregado correctamente",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
/*metodo para listar todos los cursos*/
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

/*metodo para llamar a todos los cursos que un usuario en concreto haya registrado */
routes.get("/getAllCoursesByUser", async (req, res) => {
  try {
    const { nuevamntToken } = req.body;
    let id_user;
    if (nuevamntToken !== undefined) {
      jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
        err ? res.status(401).json() : (id_user = decoded.id);
      });
      const getAllCoursesByUser = await prisma.tb_curso.findMany({
        where: {
          fk_id_usuario_curso: id_user,
        },
      });
      res.json({ getAllCoursesByUser: getAllCoursesByUser });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = routes;
