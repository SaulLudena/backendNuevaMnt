const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3003;
const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const loginRoute = require("./routes/login");
const categoryRoute = require("./routes/category");
const app = express();
const horaActual = require("./config/date");
const path = require("path");

app.set("port", PORT || 9000);
app.listen(PORT, () =>
  console.log(
    `Server running on port ${app.get("port")}  ` +
      horaActual +
      "----------------------"
  )
);

//middlewares---------------------------------------------------------
//permitir ver todos los archivos de la carpeta assets
app.use(express.static("./assets"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

//test api
app.get("/", (req, res) => {
  res.send("bienvenido a la api rest de nuevamente");
});

//rutas para las funciones de los usuarios
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/login", loginRoute);
app.use("/category", categoryRoute);
