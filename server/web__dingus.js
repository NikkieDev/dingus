const express = require('express');
const conf = require('./private/config.json');
const fs = require('fs');
const stripe = require('stripe')(conf.key)
const mc = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const port = conf.port;

app.use('/', express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/', (req, res) => {
    // load all pages
});

app.post('/connect_discord', async (req, res) => {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    const exists = await col.findOne({userid: req.body.id});

    if (exists) {
        const existsMail = await col.findOne({userid: req.body.id, email: req.body.email});
        if (existsMail) {
            conn.close();
            return res.status(200).json({message: 'logged in', statusCode: 200});
        }

        await col.updateOne({userid: req.body.id}, {$set: {email: req.body.email}});
    }
    else res.status(500).json({message: "Account doesn't exist yet!", statusCode: 500});

    conn.close();
    return res.status(200).json({message: "Email matched to account", statusCode: 200});
});

app.post('/fetch_user', async (req, res) => {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    const exists = await col.findOne({userid: req.body.id});

    conn.close();
    if (exists) return res.status(200).json({statusCode: 200, _rel: {username: exists.name, id: exists.id, tokens: exists.tokens, gifts: exists.gift_tokens}});
    else return res.status(500).json({statusCode: 500, message: "User not found"});
})

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