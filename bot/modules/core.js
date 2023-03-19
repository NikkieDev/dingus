const mc = require('mongodb').MongoClient;
const config = require('../private/config.json');

async function initializeAccount(userid) {
    console.log(`Creating user account '${userid}'`)
    const conn = await mc.connect(config.conn);
    const db = conn.db(config.db)
    const col = db.collection(config.col)

    const newUser = {
        userid: userid,
        tokens: 100,
        gift_tokens: 0,
        name: 'Not set',
        gender: 'Not set',
        pronouns: 'Not set',
        sexuality: 'Not set',
        sig_other: 'Single',
        email: 'Not set',
        unlim: false,
    }

    await col.insertOne(newUser);
    await conn.close();

    return true;
}

async function accountExists(userid) {
    const conn = await mc.connect(config.conn);
    const db = conn.db(config.db);
    const col = db.collection(config.col);
    const user = await col.findOne({userid: userid});

    if (!user) {await conn.close(); return false}
    else if (user) {await conn.close(); return true};
}


async function fetchUser(user) {
    const conn = await mc.connect(config.conn);
    const db = conn.db(config.db);
    const col = db.collection(config.col);
    
    const userData = await col.findOne({userid: user});
    if (!userData) {
        await conn.close();
        return false
    } else {
        await conn.close();
        return userData;
    }
}

module.exports = {
    initializeAccount,
    accountExists,
    fetchUser
}