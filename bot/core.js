const mc = require('mongodb').MongoClient;
const config = require('./private/config.json');

async function initializeAccount(userid) {
    console.log(`Creating user account '${userid}'`)
    const conn = await mc.connect(config.conn);
    const db = conn.db(config.db)
    const col = db.collection(config.col)

    const newUser = {
        userid: userid,
        tokens: 100,
        gift_tokens: 0,
        name: '',
        gender: '',
        pronouns: '',
        sig_other: undefined,
        email: '',
        unlim: false
    }

    await col.insertOne(newUser);
    conn.close();

    return true;
}

async function accountExists(userid) {
    const conn = await mc.connect(config.conn);
    const db = conn.db(config.db);
    const col = db.collection(config.col);
    const user = await col.findOne({userid: userid});

    if (!user) {conn.close(); return false}
    else if (user) {conn.close(); return true};
}

module.exports = {
    initializeAccount,
    accountExists
}