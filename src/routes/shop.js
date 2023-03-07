const mercadopago = require("mercadopago");

routes.post("/crearorden", async (req, res) => {
  /*metodo para registrar un pedido*/
  mercadopago.configure({
    access_token:
      "TEST-1823274520586439-030217-62be74e04061af09177461e3274c0abb-270614487",
  });
  var preference = {
    items: [
      {
        title: "Curso programacion test",
        quantity: 1,
        currency_id: "PEN",
        unit_price: 10.5,
      },
    ],
    back_url: "",
  };

  mercadopago.preferences
    .create(preference)
    .then((r) => {
      res.json(r);
    })

    .catch((e) => {
      console.log(e);
    });
  res.send("testing");
});

routes.post("/notificacionorden", async (req, res) => {
  const datos = req.query;

  console.log(datos);
  req.status(200);
});
/*
First, i need to bring up the entyre object array from localStorage and pased as Json
Second, i need to provide just the data that mercadopago needs like title, quantity, currency_id and unit_price
Third, i need to CREATE A NEW ACCOUNT TO SIMULATE a selling configuring the credentials in frontend and backend
Fourth, i need to handle errors
Five, i need to storage the main info in my database with prisma db, be careful with everything
*/
