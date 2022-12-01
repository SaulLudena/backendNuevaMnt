const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3003;
const mysql = require("mysql");

//conexion
const conexion = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nuevmnt_test",
});

//consifurando el entorno
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//test api
app.get("/", (req, res) => {
  res.send("obteniendo datos por get");
});

//validate user
app.get("/validateUser/:correo/:password", (req, res) => {
  var userObject = {
    apellido_usuario: "",
    contra_usuario: "",
    email_usuario: "",
    estado_usuario: "",
    fecha_registro_usuario: "",
    fk_id_rol: "",
    id_rolUsuario: "",
    id_usuario: "",
    nombre_publico_usuario: "",
    nombre_tipoUsuario: "",
    nombre_usuario: "",
    telefono_usuario: "",
  };
  const { correo, password } = req.params;
  const spValidateUser = "call spValidateUser(?,?)";

  conexion.query(spValidateUser, [correo, password], (error, result) => {
    //validando errores principales
    if (error) res.send("error");
    //validando que existan elementos en el array maestro
    if (result.length > 0) {
      //console.log(result[0]);
      //si el array está vacio entonces la respuesta será un objeto sin valores
      if (result[0].length <= 0) {
        res.status(404).send("Not Found");
        //si el array está lleno entonces enviará el objeto userObject con todos los valores provenientes de la base de datos
      } else if (result[0].length > 0) {
        //arrojando los resultados
        res.json(
          (userObject = {
            apellido_usuario: result[0][0].apellido_usuario,
            contra_usuario: result[0][0].contra_usuario,
            email_usuario: result[0][0].email_usuario,
            estado_usuario: result[0][0].estado_usuario,
            fecha_registro_usuario: result[0][0].fecha_registro_usuario,
            fk_id_rol: result[0][0].fk_id_rol,
            id_rolUsuario: result[0][0].id_rolUsuario,
            id_usuario: result[0][0].id_usuario,
            nombre_publico_usuario: result[0][0].nombre_publico_usuario,
            nombre_tipoUsuario: result[0][0].nombre_tipoUsuario,
            nombre_usuario: result[0][0].nombre_usuario,
            telefono_usuario: result[0][0].telefono_usuario,
          })
        );
      }
    } else if (result[0].length <= 0) {
      res.send("Not result");
    }
  });
});
