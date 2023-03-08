const express = require("express");
const routes = express.Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcryptjs = require("bcryptjs");
const horaActual = require("../config/date");
const jwt = require("jsonwebtoken");

/*Metodo para agregar a un usuario*/
routes.post("/registerUser", async (req, res) => {
  try {
    //recibiendo el objeto body y accediendo a sus propiedades
    const userData = {
      nombre_usuario: req.body.nombre_usuario,
      apellido_usuario: req.body.apellido_usuario,
      nickname_usuario: req.body.nickname_usuario,
      contra_usuario: req.body.contra_usuario,
      fecha_nacimiento_usuario: req.body.fecha_nacimiento_usuario,
      estado_usuario: true,
      fk_id_rol_usuario: 3,
      email_usuario: req.body.email_usuario,
      contra_usuario_original: req.body.contra_usuario_original,
    };

    if (
      userData.nombre_usuario.length <= 0 ||
      userData.apellido_usuario.length <= 0 ||
      userData.nickname_usuario.length <= 0 ||
      userData.contra_usuario.length <= 0 ||
      userData.contra_usuario_original.length <= 0 ||
      userData.fecha_nacimiento_usuario.length <= 0 ||
      userData.email_usuario.length <= 0
    ) {
      return res.json({ message: "Ingrese todos los campos" });
    } else {
      await prisma.tb_usuario.create({
        data: {
          nombre_usuario: userData.nombre_usuario,
          apellido_usuario: userData.apellido_usuario,
          nickname_usuario: userData.nickname_usuario,
          contra_usuario: await bcryptjs.hashSync(userData.contra_usuario, 8),
          contra_usuario_original: userData.contra_usuario_original,
          fecha_registro_usuario: new Date(horaActual),
          fecha_nacimiento_usuario: new Date(userData.fecha_nacimiento_usuario),
          estado_usuario: userData.estado_usuario,
          fk_id_rol_usuario: userData.fk_id_rol_usuario,
          email_usuario: userData.email_usuario,

          telefono_detalle_usuario: "",
          pais_detalle_usuario: "",
          provincia_usuario: "",
          ocupacion_usuario: "",
          url_foto_perfil_usuario:
            "https://res.cloudinary.com/dbtzbuew2/image/upload/v1671035838/cld-sample.jpg",
          url_foto_portada_usuario: "",
          fk_id_genero: 4,
          fk_id_tipo_documento: 4,
          numero_documento_usuario: "",
        },
      });

      res.json({
        status: 200,
        message: "Usuario agregado correctamente",
      });
    }
  } catch (error) {
    //validamos que exista un error de tipo prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //validamos que el tipo de error sea un error de datos duplicados "P2002"
      if (error.code === "P2002") {
        //nos indica que el campo email usuario ya existe en la base de datos
        if (error.meta.target === "email_usuario")
          res.json({
            message: "Email no disponible, ingrese otro",
          });
        //nos indica que el campo nombre publico usuario usuario ya existe en la base de datos
        if (error.meta.target === "nickname_usuario")
          res.json({
            message: "Nombre de usuario no disponible, ingrese otro",
          });
      }
    }
  }
});

//este metodo sirve para llamar la informacion de un usuario
//en base a un id desencriptado
//llamará a su Nombre, apodo Rol, Imagen
routes.post("/getUserData", async (req, res) => {
  const { nuevamentetoken } = req.body;
  try {
    jwt.verify(
      nuevamentetoken,
      process.env.SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          res.status(401).json();
        } else {
          const { id } = decoded;
          const user = await prisma.tb_usuario.findUnique({
            where: { id_usuario: id },
            include: {
              tb_rol_usuario: true,
            },
          });

          const userInfo = {
            nombre_usuario: user.nombre_usuario,
            apellido_usuario: user.apellido_usuario,
            nickname_usuario: user.nickname_usuario,
            rol_usuario: user.tb_rol_usuario.nombre_tipo_usuario,
            telefono_detalle_usuario: user.telefono_detalle_usuario,
            pais_detalle_usuario: user.pais_detalle_usuario,
            provincia_usuario: user.provincia_usuario,

            ocupacion_usuario: user.ocupacion_usuario,
            numero_documento_usuario: user.numero_documento_usuario,
            url_foto_perfil_usuario: user.url_foto_perfil_usuario,
            url_foto_portada_usuario: user.url_foto_portada_usuario,
          };

          res.json({ userInfo });
        }
      }
    );
  } catch (error) {
    res.json({ error });
  }
});
//este metodo sirve para traer el tipo de estudiante [alumno,admin,docente]
routes.post("/validateUserType", async (req, res) => {
  const { nuevamentetoken } = req.body;
  console.log(nuevamentetoken);
  try {
    jwt.verify(
      nuevamentetoken,
      process.env.SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          res.status(401).json();
        } else {
          const { id } = decoded;
          const user = await prisma.tb_usuario.findUnique({
            where: { id_usuario: id },
            include: {
              tb_rol_usuario: true,
            },
          });

          const userInfo = {
            id_tipo_usuario: user.fk_id_rol_usuario,
            rol_usuario: user.tb_rol_usuario.nombre_tipo_usuario,
          };

          res.json({ userInfo });
        }
      }
    );
  } catch (error) {
    res.json({ error });
  }
});

//este metodo sirve para llamar la meta informacion de un usuario
routes.get("/userMetaInfo");

//este metodo sirve para recuperar la contrasenia deun usuario
routes.post("/recoverPassword", async (req, res) => {
  /*
  1-Recuperar email
  2-verificar si existe en la base de datos
      2.1-si existe entonces preparar una nueva contraseña (con random key generator),
      2.2-despues preparar la funcion update del campo contra_usuario
      2.3-luego, ejecutar la funcion update del campo contra usuario de la tabla usuario,
      2.4-luego, ejecutar la funcion emailer la cual enviará al correo electronico registrado
      un mensaje que contenga un pequeño estilo de Nuevamente que mostrará la clave generada
  3-si el correo no existe en la bd entonces se enviará una notificación
  */
});

//este metodo sirve para validar en tiempo real los correos y nombre de usuarios unicos
routes.get("/verifyEmailAndNickName", async (req, res) => {
  const validationFieldForms = await prisma.tb_usuario.findMany({
    select: {
      nickname_usuario: true,
      email_usuario: true,
    },
  });

  res.json(validationFieldForms);
});

module.exports = routes;
