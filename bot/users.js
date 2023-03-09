const mc = require('mongodb').MongoClient;
const conf = require('./private/config.json');

async function setPronouns(user, pronouns) {
    const conn = await mc.connect(conf.conn);
    const db = conn.db(conf.db);
    const col = db.collection(conf.col);

    await col.updateOne({userid: user}, {$set: {pronouns: pronouns}});

    return 
}

async function setGender(user, gender) {

}

async function setName(user, name) {

}

async function setPartner(user, target) {

}

module.exports = {
    setPronouns,
    setGender,
    setName,
    setPartner
}