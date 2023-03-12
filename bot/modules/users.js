const mc = require('mongodb').MongoClient;
const conf = require('../private/config.json');

async function setPronouns(user, pronouns) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$set: {pronouns: pronouns}});
    return await conn.close();
}

async function setGender(user, gender) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$set: {gender: gender}});
    return await conn.close();
}

async function setSex(user, sexuality) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$set: {sexuality: sexuality}});
    return await conn.close();
}

async function setName(user, name) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$set: {name: name}});
    return await conn.close();
}

async function setPartner(user, target) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$set: {sig_other: target}});
    return await conn.close();
}

module.exports = {
    setPronouns,
    setGender,
    setName,
    setPartner,
    setSex
}