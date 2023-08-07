//configuramos la fecha y hora actual para la base de datos
let date = new Date(),
  año = date.getFullYear(),
  mes = ("0" + (date.getMonth() + 1)).slice(-2),
  dia = ("0" + date.getDate()).slice(-2),
  horas = date.getHours(),
  minutos = date.getMinutes(),
  segundos = ("0" + (date.getSeconds() + 1)).slice(-2),
  horaActual = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos} `;
module.exports = horaActual;
