require('dotenv').config();
const express = require('express');
const exphbs  = require('express-handlebars');
const port = process.env.PORT || 3000
const mercadopago = require('mercadopago')
const bodyparser = require('body-parser');

let app = express();

mercadopago.configure({
  access_token: 'APP_USR-2572771298846850-120119-a50dbddca35ac9b7e15118d47b111b5a-681067803',
  integrator_id : 'dev_24c65fb163bf11ea96500242ac130004'
})

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post('/checkout', function (req, res) {
  const items = [
      {
          id: 1234,
          title: req.body.title,
          description: "Dispositivo móvil de Tienda e-commerce",
          picture_url: req.body.img,
          quantity: parseInt(req.body.unit),
          unit_price: parseFloat(req.body.price),
          category_id: 'phones',
          currency_id: 'COP'
      }
  ];
  const preferences = {
      items,
      external_reference: "andresdavidsolartevidal@gmail.com",
      payer: {
          name: "Lalo",
          surname: "Landa",
          email: "test_user_83958037@testuser.com",
          identification: {
              type:'CC',
              number: "12345678999"
          },
          phone: {
              area_code: "52",
              number: parseInt(5549737300)
          },
          address: {
              street_name: "Insurgentes Sur",
              street_number: 1602,
              zip_code: "03940"
          }
      },
      payment_methods: {
          excluded_payment_methods: [
              {
                  id: "amex"
              }
          ],
          excluded_payment_types: [{ id: "atm" }],
          installments: 6,
      },
      back_urls: {
          success: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/success",
          failure: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/failure",
          pending: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/pending"
      },
      notification_url: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/webhook",
      auto_return: "approved"
  };
  mercadopago.preferences.create(preferences)
      .then(function (response) {
          // Este valor reemplazará el string "<%= global.id %>" en tu HTML
          global.id = response.body.id;

          console.log("Preferences id -> "+response.body.id);
          console.log(response);

          res.redirect(response.body.init_point);

      }).catch(function (error) {
      console.log(error);
  });
});

app.get('/success', function (req, res) {
  res.render('success', req.query);
});
app.get('/failure', function (req, res) {
  res.render('failure', req.query);
});
app.get('/pending', function (req, res) {
  res.render('pending', req.query);
});

app.post('/webhook', function (req, res) {
    let body = ""; 
    req.on("data", chunk => {  
    body += chunk.toString();
    });
    req.on("end", () => {  
    console.log(body, "webhook response"); 
    res.end("ok");
    });
    return res.status(200);
});


app.listen(port, function () {
    console.log(`Listening http://localhost:${port}`);
});
