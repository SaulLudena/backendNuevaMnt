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

app.set("port", PORT || 9000);
app.listen(PORT, () =>
  console.log(
    `Server running on port ${app.get("port")}  ` +
      horaActual +
      "----------------------"
  )
);

//middlewares---------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

//test api
app.get("/", (req, res) => {
  res.send("bienvenido a la api rest de nuevamente");
});

//ruta para usuarios
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/login", loginRoute);
app.use("/category", categoryRoute);
