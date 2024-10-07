const db = require('../database');
const filterFornitoriAPI = require('./UtilsAPI/filterFornitoriAPI');
const checkIfNameExists = require('./UtilsAPI/checkIfNameExists')
const cleanString = require('./UtilsAPI/cleanString')


function getFornitori(callback, filterFornitori = {}) {
  let query = `
    SELECT 
    f.id_fornitore     as idFornitore, 
    f.name             as name, 
    f.address          as address, 
    f.partiva_iva      as pIva, 
    f.email            as email, 
    f.phone            as phone
    FROM fornitori f`;

  const { filterQuery, params } = filterFornitoriAPI(filterFornitori);
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

function addFornitori(data, callback) {

  const { name, address, email, phone, pIva } = data;


  checkIfNameExists(name, 'fornitori', (err, exists) => {

    if (err) {
      callback(err, null);
      return;
    }

    if (exists) {
      callback(null, 'Fornitore esistente');
      return;
    }

    const query = `
      INSERT INTO fornitori (name, address, email, phone, partiva_iva)
      VALUES (?, ?, ?, ?, ?)
    `;

    const nameCleaned = cleanString(name, true, true, false)

    db.run(query, [nameCleaned, address, email, phone, pIva], function (err) {
      if (err) {
        console.error('Error adding fornitore to database:', err);
        callback(err, null);
        return;
      }

      const newFornitore = {
        idFornitore: this.lastID,
        name: cleanString(name, false, true, true),
        address,
        email,
        phone,
        pIva
      };

      callback(null, newFornitore);
    });
  });
}

function updateFornitori(idFornitore, data, callback) {
  const { name, address, email, phone, pIva } = data;

  // Controlla se il nome esiste nella tabella 'fornitori'
  checkIfNameExists(name, 'fornitori', (err, exists) => {
    if (err) {
      callback(err, null);
      return;
    }

    let query;
    let params;

    // Se il nome esiste già, aggiorna solo gli altri campi
    if (exists) {
      query = `
        UPDATE fornitori
        SET address = ?, email = ?, phone = ?, partiva_iva = ?
        WHERE id_fornitore = ?
      `;
      params = [address, email, phone, pIva, idFornitore];
    } else {
      // Se il nome non esiste, aggiorna anche il nome
      query = `
        UPDATE fornitori
        SET name = ?, address = ?, email = ?, phone = ?, partiva_iva = ?
        WHERE id_fornitore = ?
      `;
      params = [cleanString(name, false, true, true), address, email, phone, pIva, idFornitore];
    }

    // Esegui l'aggiornamento nel database
    db.run(query, params, function (err) {
      if (err) {
        console.error('Error updating fornitore in database:', err);
        callback(err, null);
        return;
      }

      const updatedFornitore = { idFornitore, name, address, email, phone, pIva };
      callback(null, updatedFornitore); // Restituisci il fornitore aggiornato
    });
  });
}

function deleteFornitori(idFornitore, callback) {
  const deleteCostiQuery = `
    DELETE FROM costi
    WHERE id_fornitore = ?
  `;
  const deleteFornitoreQuery = `
    DELETE FROM fornitori
    WHERE id_fornitore = ?
  `;

  db.serialize(() => {
    db.run(deleteCostiQuery, [idFornitore], function (err) {
      
      if (err) {
        console.error('Error deleting costs from database:', err);
        callback(err, null);
        return;
      }

      db.run(deleteFornitoreQuery, [idFornitore], function (err) {
        if (err) {
          console.error('Error deleting fornitore from database:', err);
          callback(err, null);
          return;
        }

        callback(null, { idFornitore });
      });
      
    });
  });
}

module.exports = {
  getFornitori,
  addFornitori,
  updateFornitori,
  deleteFornitori
};
