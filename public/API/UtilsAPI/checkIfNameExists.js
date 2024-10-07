const db = require('../../database');
const cleanString = require('./cleanString')

function checkIfNameExists(name, tableName, callback) {
    if (!tableName) {
        callback(new Error('Table name is required'), null);
        return;
    }

    const query = `SELECT COUNT(*) as count FROM ${tableName.toLowerCase()} WHERE name = ?`;

    const nameCleaned = cleanString(name, true, true, false)

    db.get(query, [nameCleaned], (err, row) => {
        if (err) {
            console.error('Error checking name existence:', err);
            callback(err, null);
            return;
        }

        callback(null, row.count > 0);
    });
}

module.exports = checkIfNameExists;
