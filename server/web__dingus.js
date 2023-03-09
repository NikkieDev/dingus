const express = require('express');
const stripe = require('stripe')//(key)
const conf = require('./private/config.json');

const app = express();
const port = conf.port;

app.get('/', (req, res) => {
    // load all pages
});

app.post('/checkout', (req, res) => {

});

app.listen(port, () => {
    console.log(`${conf.name} is running on ${conf.port}`);
});