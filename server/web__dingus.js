const express = require('express');
const conf = require('./private/config.json');
const fs = require('fs');
const stripe = require('stripe')(conf.key)

const app = express();
const port = conf.port;

app.get('/', (req, res) => {
    // load all pages
});

app.post('/checkout', async (req, res) => {
    const products = new Map(conf.products);

    try {
        const ses = await stripe.checkout.sessions.create({
            payment_method_types: ['ideal', 'card'],
            line_items: req.body.items.map(item => {
                const product = products.get(item.id);

                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: product.name,
                            description: product.desc
                        },
                        unit_amount: product.priceInCents,
                    },
                    quantity: item.quantity,
                }
            }),
            mode: 'payment',
            success_url: `${conf.protocol}://${conf.url}/topup/success`,
            cancel_url: `${conf.protocol}://${conf.url}/topup/failure`
        });
        return res.status(200).json({message: 'Successfully created checkout url', url: ses.url, statusCode: 200});
    } catch (e) {
        if (e) console.log(e);
        return res.status(500).json({msg: "A payment issue has occured, you've not been charged.", statusCode: 500});
    }
});

app.listen(port, () => {
    console.log(`${conf.name} is running on ${conf.port}`);
});