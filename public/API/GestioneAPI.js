const db = require('../database');
const filterGestioneAPI = require('./UtilsAPI/filterGestioneAPI');
const checkIfNameExists = require('./UtilsAPI/checkIfNameExists')
const cleanString = require('./UtilsAPI/cleanString')

function getGestione(callback, filterGestione = {}) {
  let query = `
    SELECT 
    g.id_gestione     as idGestione, 
    g.name            as name
    FROM gestione g`;

  const { filterQuery, params } = filterGestioneAPI(filterGestione);
  query += filterQuery;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      callback(err, null);
      return;
    }
    callback(null, rows);
  });
}

function addGestione(data, callback) {
  const { name } = data;

  checkIfNameExists(name, 'gestione', (err, exists) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (exists) {
      callback(null, 'Gestione esistente');
      return;
    }

    const query = `
      INSERT INTO gestione (name)
      VALUES (?)
    `;

    const nameCleaned = cleanString(name, true, true, false)

    db.run(query, [nameCleaned], function (err) {
      if (err) {
        console.error('Error adding gestione to database:', err);
        callback(err, null);
        return;
      }

      const newGestione = {
        idGestione: this.lastID,
        name:cleanString(name, false, true, true)
      };

      callback(null, newGestione);
    });
  });
}

function updateGestione(idGestione, data, callback) {
  
  const { name } = data;

  checkIfNameExists(name, 'gestione', (err, exists) => {
    if (err) {
      callback(err, null);
      return;
    }

    if (exists) {
      callback(null, {idGestione,name});
      return;
    }

    const query = `
      UPDATE gestione
      SET name = ?
      WHERE id_gestione = ?
    `;

    db.run(query, [cleanString(name, false, true, true), idGestione], function (err) {
      if (err) {
        console.error('Error updating gestione in database:', err);
        callback(err, null);
        return;
      }

      const updatedGestione = {
        idGestione,
        name
      };

      callback(null, updatedGestione);
    });
  });
}

function deleteGestione(idGestione, callback) {
  const deleteCostiQuery = `
    DELETE FROM costi
    WHERE id_gestione = ?
  `;

  const deleteGestioneQuery = `
    DELETE FROM gestione
    WHERE id_gestione = ?
  `;

  db.serialize(() => {
    db.run(deleteCostiQuery, [idGestione], function (err) {

      if (err) {
        console.error('Error deleting costs from database:', err);
        callback(err, null);
        return;
      }

      db.run(deleteGestioneQuery, [idGestione], function (err) {
        if (err) {
          console.error('Error deleting gestione from database:', err);
          callback(err, null);
          return;
        }

        callback(null, { idGestione });
      });
      
    });
  });
}

module.exports = {
  getGestione,
  addGestione,
  updateGestione,
  deleteGestione
};
