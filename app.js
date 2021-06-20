var express = require('express');
var exphbs = require('express-handlebars');
var port = process.env.PORT || 3000
const bodyParser = require('body-parser');

const mercadoPago = require('./controller/mercadopago');

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post('/checkout', mercadoPago.creteReference);

app.get('/success', (req, res) => {
    res.render('success', req.query)
});

app.get('/failure', (req, res) => {
    res.render('failure', req.query);
});

app.get('/pending', (req, res) => {
    res.render('pending', req.query);
});

app.post('/webhook', (req, res) => {
    console.log(req.body, "Webhook");
    res.status(200).send('ok');
})

app.listen(port, function () {
    console.log(`Listening http://localhost:${port}`);
});
