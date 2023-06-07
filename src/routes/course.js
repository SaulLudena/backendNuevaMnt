const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const horaActual = require("../config/date");
const multer = require("multer");

// Configuración de Multer para almacenar las imagenes del curso
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fieldName = file.fieldname;
    //destino de imagenes para thumbnail_curso
    if (fieldName === "thumbnail_curso") {
      destination = "assets/images/course_images";
      cb(null, destination);
    } //destino de imagenes para imagen de cada leccion
    else if (fieldName === "leccion_imagen") {
      destination = "assets/images/lessons_images";
      cb(null, destination);
    }
    //destino de imagenes para recursos del curso
    else if (fieldName === "recursos_curso") {
      destination = "assets/files/course_resources";
      cb(null, destination);
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Nombre de archivo único
  },
});

const upload = multer({ storage: storage });

/*metodo para agregar un curso por un docente*/
routes.post(
  "/addNewCourse",
  //recuperamos los archivos enviados desde el formulario para un curso
  upload.fields([
    { name: "thumbnail_curso", maxCount: 1 },
    { name: "leccion_imagen", maxCount: 1000 },
    { name: "recursos_curso", maxCount: 1000 },
  ]),
  async (req, res) => {
    try {
      //recuperamos el curso y el token del administrador o docente
      const curso = req.body;
      const nuevamntToken = curso.nuevamenteToken;
      const data = curso;
      //variable para almacenar el id del administrador o el docente
      let id_user;
      console.log(data.thumbnail_curso);
      console.log(req.files.thumbnail_curso.path);
      //verificamos que haya un token para agregar un curso
      if (nuevamntToken !== undefined) {
        //asignamos el codigo del usuario encontrado a la variable
        jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
          err ? res.status(401).json() : (id_user = decoded.id);
        });

        //registramos un curso
        const courseRegistered = await prisma.tb_curso.create({
          data: {
            nombre_curso: data.titulo_curso || "",
            slug_curso: data.slug_curso || "",
            descripcion_curso: data.descripcion_curso || "",
            tipo_precio_curso: data.tipo_precio_curso || "",
            precio_regular_curso: parseInt(data.precio_regular_curso) || 0,
            precio_descuento_curso: parseInt(data.precio_descuento_curso) || 0,
            que_aprendere_curso: data.que_aprendere_curso || "",
            video_introductorio_curso: data.video_introductorio_curso || "",
            publico_objetivo_curso: data.publico_objetivo_curso || "",
            duracion_horas_curso: parseInt(data.duracion_horas_curso) || 0,
            duracion_minutos_curso: parseInt(data.duracion_minutos_curso) || 0,
            materiales_incluidos_curso: data.materiales_incluidos_curso || "",
            etiquetas_curso: data.etiquetas_curso || "",
            fecha_registro_curso: new Date(horaActual) || "",
            calificacion_curso: 0 || 0,
            url_imagen_principal_curso:
              process.env.DOMAIN + "/" + req.files.thumbnail_curso[0].path ||
              "",

            tb_categoria_curso: {
              connect: {
                id_categoria_curso: parseInt(data.categoria_curso) || 1,
              },
            },
            tb_usuario: {
              connect: {
                id_usuario: id_user,
              },
            },
          },
        });

        //validamos que el arreglo esté lleno
        if (data.modulos_curso !== undefined) {
          //registrando los modulos
          const modulos_curso_array = JSON.parse(data.modulos_curso);
          await prisma.tb_modulo.createMany({
            data: modulos_curso_array.map((modulo) => {
              return {
                nombre_modulo: modulo.moduleName || "",
                resumen_modulo: modulo.moduleDescription || "",
                fk_id_curso: courseRegistered.id_curso || null,
                fecha_registro_modulo: new Date(horaActual) || "",
              };
            }),
          });
          //encontrando todos los modulos en base a un id
          const getModulesById = await prisma.tb_modulo.findMany({
            where: {
              fk_id_curso: courseRegistered.id_curso,
            },
          });

          //registrando las lecciones
          modulos_curso_array.map(async (modulo, index) => {
            const lessonsArray = modulo.lessons.map((lesson, index) => {
              return {
                nombre_leccion: lesson.leccion_titulo || "",
                descripcion_leccion: lesson.leccion_descripcion || "",
                imagen_destacada_leccion:
                  process.env.DOMAIN +
                    "/" +
                    req.files.leccion_imagen[index].path || "",
                url_video_leccion: lesson.leccion_enlace || "",
                duracion_hora_leccion:
                  parseInt(lesson.leccion_duracion_horas) || 0,
                duracion_minuto_leccion:
                  parseInt(lesson.leccion_duracion_minutos) || 0,
                duracion_segundo_leccion:
                  parseInt(lesson.leccion_duracion_segundos) || 0,
                fecha_registro_leccion: new Date(horaActual) || "",
                progreso_leccion: false,
                fk_id_modulo: getModulesById[index].id_modulo || null,
              };
            });
            await prisma.tb_leccion.createMany({
              data: lessonsArray,
            });
          });

          //validamos que el arreglo de recursos esté lleno
          if (
            req.files.recursos_curso !== undefined &&
            req.files.recursos_curso.length > 0
          ) {
            // Registrando los recursos
            const recursos_curso_array = req.files.recursos_curso;

            await prisma.tb_recursos.createMany({
              // Creamos los recursos
              data: recursos_curso_array.map((recurso, index) => {
                return {
                  nombre_recurso: recursos_curso_array[index].originalname,
                  url_recurso:
                    process.env.DOMAIN + recursos_curso_array[index].path || "",
                  fecha_registro_recurso: new Date(horaActual) || "",
                  fk_id_curso: courseRegistered.id_curso || null,
                };
              }),
            });
          }
        }

        res.json({
          status: 200,
          message: "Curso agregado correctamente",
        });
      }
    } catch (error) {
      33;
      console.log(error);
    }
  }
);

/*metodo para mostrar un curso en base al id del curso y en base al id del usuario del token */
routes.post("/getCourseById", async (req, res) => {
  try {
    /*recuperamos el id del curso y el token del administrador o docente */
    const { id_curso, nuevamntToken } = req.body;
    /*variable para almacenar el id del administrador o el docente */
    let id_user;
    /*verificamos que haya un token para agregar un curso */
    if (nuevamntToken !== undefined) {
      /*asignamos el codigo del usuario encontrado a la variable */
      jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
        err ? res.status(401).json() : (id_user = decoded.id);
      });
      /*buscamos el curso en base al id del curso y al id del usuario, retornar todos los modulos y lecciones en base al id del modulo */
      const getCourseById = await prisma.tb_curso.findMany({
        where: {
          id_curso: parseInt(id_curso),
          fk_id_usuario_curso: id_user,
        },
        include: {
          /*llamar a todos los modulos y tambien llamar a las lecciones en base al id del modulo*/
          tb_modulo: {
            include: {
              tb_leccion: true,
            },
          },
          tb_categoria_curso: true,
        },
      });
      /*validamos que el curso exista */
      if (getCourseById.length > 0) {
        res.json({
          status: 200,
          message: "Curso encontrado",
          getCourseById: getCourseById,
        });
      } else {
        res.json({
          status: 404,
          message: "Curso no encontrado",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

/*metodo para eliminar un curso de la base de datos */
routes.delete("/deleteCourseById", async (req, res) => {
  try {
    /*recuperamos el id del curso y el token del administrador o docente */
    const { id_curso, nuevamntToken } = req.query;

    /*variable para almacenar el id del administrador o el docente */
    let id_user;
    /*verificamos que haya un token para agregar un curso */
    if (nuevamntToken !== undefined) {
      /*asignamos el codigo del usuario encontrado a la variable */
      jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
        err ? res.status(401).json() : (id_user = decoded.id);
      });
      /*buscamos el curso en base al id del curso y al id del usuario, retornar todos los modulos y lecciones en base al id del modulo */
      const deleteCourseById = await prisma.tb_curso.deleteMany({
        where: {
          id_curso: parseInt(id_curso),
          fk_id_usuario_curso: id_user,
        },
      });
      /*validamos que el curso exista */
      if (deleteCourseById.count > 0) {
        res.json({
          status: 200,
          message: "Curso eliminado correctamente",
        });
      } else {
        res.json({
          status: 404,
          message: "Curso no encontrado",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

/*metodo para listar todos los cursos en la tienda*/
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
routes.post("/getRegisteredCousesByAdminOrInstructor", async (req, res) => {
  try {
    const { nuevamntToken } = req.body;
    let id_user;
    if (nuevamntToken !== undefined) {
      jwt.verify(nuevamntToken, process.env.SECRET_KEY, (err, decoded) => {
        err ? res.status(401).json() : (id_user = decoded.id);
      });
      /*validar que no sea arreglo no sea null */

      const getRegisteredCousesByAdminOrInstructor =
        await prisma.tb_curso.findMany({
          where: {
            fk_id_usuario_curso: id_user,
          },
          include: {
            tb_categoria_curso: true,
            tb_modulo: true,
            tb_usuario: {
              select: { email_usuario: true },
            },
          },
        });
      res.json({
        getRegisteredCousesByAdminOrInstructor:
          getRegisteredCousesByAdminOrInstructor,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = routes;
