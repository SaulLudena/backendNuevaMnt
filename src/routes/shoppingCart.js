const express = require("express");
const routes = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const horaActual = require("../config/date");

module.exports = routes;

/*metodo para mostrar los todos cursos registrados e indicar si un curso ha sido comprado en base al ID del token recibido*/
routes.get("/allCourses", async (req, res) => {});
