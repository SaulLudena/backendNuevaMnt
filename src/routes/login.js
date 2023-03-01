const express = require("express");
const routes = express.Router();
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

routes.post("/login", async (req, res) => {
  try {
    //recuperamos las credenciales
    const { email, password } = req.body;
    const email_usuario = email,
      contra_usuario = password;

    //recuperamos los datos en base a un correo
    const validateUser = await prisma.tb_usuario.findUnique({
      where: {
        email_usuario: email_usuario,
      },
    });
    if (email_usuario.length <= 0 || contra_usuario.length <= 0) {
      res.json({ message: "Todos los campos son necesarios" });
    } else {
      if (validateUser !== null) {
        //validamos que ningún resultado esté vacio
        bcryptjs.compare(
          contra_usuario,
          validateUser.contra_usuario,
          (rq, rs) => {
            if (rs === true) {
              //aqui expulsamos la informacion en formato json
              //deberias votar el jwt
              const userDataWithJwt = {
                id: validateUser.id_usuario,
                message: "OK",
                status: 200,
              };
              const token = jwt.sign(userDataWithJwt, process.env.SECRET_KEY, {
                expiresIn: "10h",
              });

              return res.json({
                message: "Credenciales correctas",
                token,
              });
            } else {
              res.json({ message: "Email o contrasena incorrecta" });
            }
          }
        );
      } else {
        res.json({
          message: "Email o contrasena incorrecta",
        });
      }
    }
  } catch (error) {
    res.json({ error });
  }
});

routes.get("/protected", (req, res) => {
  // Verificar token
  try {
    // Obtener token del encabezado de autorización
    const receivedToken = req.headers["authorization"];
    jwt.verify(receivedToken, process.env.SECRET_KEY, (err, decoded) => {
      err ? res.status(401).json() : res.json({ decoded });
    });
  } catch (error) {
    res.json({ message: "algo pasó" });
  }
});

module.exports = routes;
