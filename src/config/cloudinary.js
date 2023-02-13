const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary");

const cloudinaryCredentials = cloudinary.config({
  cloud_name: "dbtzbuew2",
  api_key: "478299585134674",
  api_secret: "wP0yhcsRzOKlmh_kJxzhqOZR4sQ",
});

var storage = multer.diskStorage({
  filename: (req, file, callBack) => {
    callBack(
      null,
      `foto_perfil_usuario_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

var upload = multer({
  storage: storage,
});
module.exports = cloudinaryCredentials;
