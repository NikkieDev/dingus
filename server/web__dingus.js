const express = require('express');
const conf = require('./private/config.json');
const fs = require('fs');
const stripe = require('stripe')(conf.key)
const mc = require('mongodb').MongoClient;
const cors = require('cors');
const md5 = require('md5');
const ws = require('ws');

const app = express();
const port = conf.port;

app.use('/', express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.get('/', (req, res) => {
    return res.status(200).sendFile(`${__dirname}/public/index.html` );
});

app.get('/discord', (req, res) => {
    return res.status(200).sendFile(`${__dirname}/public/index.html`);
})

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

    conn.close();
    return res.status(200).json({message: "Email matched to account", statusCode: 200});
});

app.post('/upvote', (req, res) => {
    const soc = new ws('ws://localhost:3006');
    soc.onopen = () => soc.send(JSON.stringify({state: 'connect', authorization: 'SERVER_BALLS', target: 'bot'}));
    res.status(200).send({connecting: true});
});

app.post('/fetch_user', async (req, res) => {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    const exists = await col.findOne({userid: req.body.id});

    conn.close();
    if (exists) return res.status(200).json({statusCode: 200, _rel: {username: exists.name, id: exists.id, tokens: exists.tokens, gifts: exists.gift_tokens, premium: exists.unlim}});
    else return res.status(500).json({statusCode: 500, message: "User not found"});
})

app.get('/topup/success/:id/:user_id', async (req, res) => {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);
    const paym_info = await JSON.parse(fs.readFileSync(`${__dirname}/private/orders/${req.params.id}.json`));

    if (paym_info['product']['type'] == 'gift_tokens') {
        const updated = await col.updateOne({userid: req.params.user_id}, {$inc: {gift_tokens: paym_info['product']['amount']}});
    } else if (paym_info['product']['type'] == 'tokens') {
        const updated = await col.updateOne({userid: req.params.user_id}, {$inc: {tokens: paym_info['product']['amount']}});
    } else if (paym_info['product']['type'] == 'premium') {
        const updated = await col.updateOne({userid: req.params.user_id}, {$set: {unlim: paym_info['product']['amount']}});
    }

    let cache = paym_info;
    cache['status'] = 'fullfilled';
    cache['payment_success'] = true;

    await fs.writeFileSync(`${__dirname}/private/orders/${req.params.id}.json`, JSON.stringify(cache));
    
    // res.status(200).json({message: 'Your balance has been topped up succesfully', statusCode: 200, type: paym_info['product']['type'], value: paym_info['product']['amount']});
    return res.status(200).redirect('/');
});

app.get('/topup/failure/:id', (req, res) => {
    return res.status(200).json({message: "Couldn't top up your balance"});
})

app.post('/checkout/', async (req, res) => {
    const products = new Map(conf.products);
    const paym_id = md5(req.body.id); // add function to cancel order if already exist
    const order_num = await fs.readdirSync(`${__dirname}/private/orders/`).length + 1;
    let prods = [];

    req.body.items.map(item => {
        const prod = products.get(item.id);

        prods.push
        ({
            name: prod.name,
            type: prod.type,
            description: prod.desc,
            amount: prod.amount
        })
    })

    try {
        const ses = await stripe.checkout.sessions.create({
            payment_method_types: ['ideal', 'card'],
            line_items: req.body.items.map(item => {
                const product = products.get(item.id);
                const prod_dat = {
                    name: product.name,
                    type: product.type,
                    description: product.desc,
                    amount: product.amount
                }

                return {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: prod_dat.name,
                            description: prod_dat.description
                        },
                        unit_amount: product.priceInCents,
                    },
                    quantity: item.quantity,
                }
            }),
            mode: 'payment',
            success_url: `${conf.protocol}://${conf.url}/topup/success/${order_num}-${paym_id}/${req.body.id}`,
            cancel_url: `${conf.protocol}://${conf.url}/topup/failure/${order_num}-${paym_id}`
        });

        const orderData = {
            status: 'created',
            product: prods[0],
            user: req.body.id
        }
        
        await fs.writeFileSync(`${__dirname}/private/orders/${order_num}-${paym_id}.json`, JSON.stringify(orderData));

        return res.status(200).json({message: 'Successfully created checkout url', url: ses.url, statusCode: 200});
    } catch (e) {
        if (e) console.log(e);
        return res.status(500).json({msg: "A payment issue has occured, you've not been charged.", statusCode: 500});
    }
});

app.listen(port, () => {
    console.log(`${conf.name} is running on ${conf.port}`);
});