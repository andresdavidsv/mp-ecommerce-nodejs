var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-2572771298846850-120119-a50dbddca35ac9b7e15118d47b111b5a-681067803',
    integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

const mercadoCheckout = {};

mercadoCheckout.creteReference = async (req, res) => {
    const { body } = req;

    const preference = {
        items: [
            {
                id: 1234,
                title: body.title,
                description: 'DispositivomóvildeTiendae-commerce',
                picture_url: body.img,
                quantity: Number(body.unit),
                currency_id: 'COP',
                unit_price: Number(body.price)
            }
        ],
        payer: {
            name: "Lalo",
            last_name: "Landa",
            email: "test_user_83958037@testuser.com",
            date_created: "2015-06-02T12:58:41.425-04:00",
            phone: {
                area_code: "52",
                number: 5549737300
            },
            address: {
                street_name: "Insurgentes Sur",
                street_number: 1602,
                zip_code: "03940"
            }
        },
        external_reference: "andresdavidsolartevidal@gmail.com",
        payment_methods: {
            excluded_payment_methods: [
            ],
            excluded_payment_types: [
                {
                    id: "amex"
                },
                {
                    id: "atm"
                }
            ],
            installments: 6
        },
        back_urls: {
            success: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/success",
            failure: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/failure",
            pending: "https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/pending"
        },
        notification_url: 'https://andresdavi-mp-ecommerce-nodejs.herokuapp.com/webhook',
        auto_return: "approved"
    };

    mercadopago.preferences.create(preference)
        .then(response => {
            console.log(response.body);
            res.redirect(response.body.init_point);
        })
        .catch(e => console.log(e))
}

module.exports = mercadoCheckout;