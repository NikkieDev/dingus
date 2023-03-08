const mc = require('mongodb').MongoClient;
const config = require('./private/config.json');

async function initializeAccount(userid) {
    const conn = await mc.connect(config.conn);
    const user = await conn.db(config.db).collection(config.collection).findOne({userid: userid});

    if (!user) {
        const newUser = {
            userid: userid,
            tokens: 100,
            gift_tokens: 0,
            name: String,
            gender: String,
            pronouns: String,
            sig_other: Number,
            email: String,
            unlim: false
        }

        await conn.db(config.db).collection(config.collection).insertOne(newUser);
        await conn.close();

        return true;
    } else {
        await conn.close();
        return false;
    }
}

async function accountExists(userid) {
    const conn = await mc.connect(config.conn);
    console.log(conn);
    conn.close();
    return;
}

async function withdraw(userid, value) {
    const conn = await mc.connect(config.conn);
    const user = conn.db(config.db).collection(config.collection).findOne({userid: userid});
    console.log(user);
}

function balanceCheck() {
    // fetch amount of tokens
}

module.exports = {
    initializeAccount,
    balanceCheck,
    accountExists
}