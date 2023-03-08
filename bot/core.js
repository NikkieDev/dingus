const sql = require('sqlite3');
const path = require('path');

const initializeAccount = (i) => {
    const db = new sql.Database(path.join(__dirname, '../private/db.sqlite3'));

    db.all("INSERT INTO `users` (userid) VALUES (?)", [i.user.id], (err) => {
        if (err) return console.error(err.message);
    });

    db.close(err => {
        if (err) return console.error(err.message);
    });

    return;
}

const execQuery = (i, query, params=null, returns=false) => {
    const db = new sql.Database(path.join(__dirname, '../private/db.sqlite3'));

    if (params.length > 0) db.all(query, params, (err, rows) => {
        if (err) return console.error(err.message);
        if (returns) {
            return rows;
        }
    });
    else db.all(query, [], (err, rows) => {
        if (err) return console.error(err.message);
        if (returns) {
            return rows;
        }
    });

    db.close(err => {
        if (err) return console.error(err.message);
    });

    return;
}

module.exports = {
    initializeAccount,
    execQuery
}