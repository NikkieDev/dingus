const mc = require('mongodb').MongoClient;
const conf = require('../private/config.json');

async function withdraw(user, amount, tokenType) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    if (tokenType == 'tokens') await col.updateOne({userid: user}, {$inc: {tokens: -amount}});
    else if (tokenType == 'gift_tokens') await col.updateOne({userid: user}, {$inc: {gift_tokens: -amount}});
    
    const rData = await col.findOne({userid: user});
    const remain = rData.tokens;

    conn.close();
    return remain;
}

async function deposit(user, amount) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$inc: {tokens: amount}});

    conn.close();
    return;
}

async function setUnlim(user) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    const prem = await col.updateOne({userid: user, unlim: true}, {$set: {tokens: 9999999}})
    await conn.close();
    return true;
}

async function balanceCheck(user, type) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    const usr = await col.findOne({userid: user});
    let balance = (type == "tokens")?usr.tokens:(type == 'gift_tokens')?usr.gift_tokens:undefined;

    conn.close();
    return balance;
}

async function affordCheck(user, price, gift) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    const userBal = await col.findOne({userid: user});
    const _userBal = (gift == false) ? userBal.tokens:userBal.gift_tokens;

    const val = (_userBal >= price) ? true:false;

    conn.close();
    return val;
}

async function gift(user, target, amount) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$inc: {gift_tokens: -amount}});
    await col.updateOne({userid: target}, {$inc: {tokens: amount}});

    conn.close();
    return;
}

module.exports = {
    withdraw,
    balanceCheck,
    affordCheck,
    gift,
    setUnlim,
    deposit
}

// optimize file with Conn/Close functions, execute query functions