const db = require('../database');
const filterCostiAPI = require('./UtilsAPI/filterCostiAPI');
const filterGestioneAPI = require('./UtilsAPI/filterGestioneAPI');

function getCostiGestione(callback, filterCosti = {}, filterGestione = {}, page = 1, pageSize = 1000) {
  let queryGestione = `
    SELECT 
      g.id_gestione as idGestione, 
      g.name as gestione
    FROM gestione g
  `;

  const { filterQuery: filterQueryGestione, params: paramsGestione } = filterGestioneAPI(filterGestione);

  // Combina i filtri per i gestione
  queryGestione += filterQueryGestione;

  // Aggiungi la paginazione per i gestione
  const offset = (page - 1) * pageSize;
  queryGestione += ` LIMIT ? OFFSET ?`;

  // Unisci i parametri dei filtri per i gestione e aggiungi quelli della paginazione
  const params = [...paramsGestione, pageSize, offset];

  db.all(queryGestione, params, (err, gestione) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      callback(err, null);
      return;
    }

    if (gestione.length === 0) {
      callback(null, []);
      return;
    }

    // Costruire una lista di idGestione per la query dei costi
    const gestioneIds = gestione.map(g => g.idGestione);

    let queryCosti = `
      SELECT 
        g.id_gestione                 as idGestione, 
        g.name                        as gestione, 
        c.id_costo                    as idCosto, 
        c.creation_date               as creationDate, 
        c.amount                      as amount, 
        c.cost_type                   as costType, 
        c.cost_number                 as costNumber, 
        c.cost_emission_date          as emissionDate,
        c.expired_date                as expiredDate, 
        c.payment_state               as paymentState, 
        c.payment_type                as paymentType,
        c.season                      as season
      FROM costi c
      JOIN gestione g ON g.id_gestione = c.id_gestione
      WHERE g.id_gestione IN (${gestioneIds.map(() => '?').join(',')})
    `;

    const { filterQuery: filterQueryCosti, params: paramsCosti } = filterCostiAPI(filterCosti);

    // Aggiungi i filtri per i costi
    if (filterQueryCosti) {
      queryCosti += ` AND ${filterQueryCosti.slice(7)}`; // Rimuovi il prefisso 'WHERE' da filterQueryCosti e aggiungi 'AND'
    }

    // Aggiungi la clausola ORDER BY per ordinare i costi per expired_date
    queryCosti += ` ORDER BY c.expired_date ASC`;

    const costiParams = [...gestioneIds, ...paramsCosti];

    db.all(queryCosti, costiParams, (err, rows) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        callback(err, null);
        return;
      }

      const data = {};

      // Inserisci solo i gestione che hanno costi associati
      rows.forEach(row => {
        if (row.idCosto) {
          if (!data[row.idGestione]) {
            data[row.idGestione] = {
              idGestione: row.idGestione,
              name: row.gestione,
              fields: []
            };
          }
          data[row.idGestione].fields.push({
            idCosto: row.idCosto,
            creationDate: row.creationDate,
            amount: row.amount,
            costType: row.costType,
            costNumber: row.costNumber,
            emissionDate: row.emissionDate,
            expiredDate: row.expiredDate,
            paymentState: row.paymentState,
            paymentType: row.paymentType,
            season: row.season
          });
        }
      });

      const result = Object.values(data).filter(gestione => gestione.fields.length > 0);
      callback(null, result);
    });
  });
}

function addCostiGestione(data, callback) {

  const { name, idGestione, payments } = data;

  if (!idGestione) {
    callback(new Error('Manca l\'ID della gestione'), null);
    return;
  }

  const paymentQueries = payments.map(payment => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO costi (id_gestione, amount, expired_date, cost_type, cost_number, cost_emission_date, last_modification_date, creation_date, payment_state, payment_type, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
        [idGestione, payment.amount, payment.expiredDate, payment.costType, payment.costNumber, payment.emissionDate, new Date(), new Date(), payment.paymentState, payment.paymentType, payment.season],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              idCosto: this.lastID,
              amount: payment.amount,
              costType: payment.costType,
              costNumber: payment.costNumber,
              emissionDate: payment.emissionDate,
              expiredDate: payment.expiredDate,
              paymentState: payment.paymentState,
              paymentType: payment.paymentType,
              season: payment.season
            });
          }
        }
      );
    });
  });

  Promise.all(paymentQueries)
    .then((paymentResults) => {
      paymentResults.sort((a, b) => new Date(a.expiredDate) - new Date(b.expiredDate));
      const gestioneObject = {
        name: name,
        idGestione: idGestione,
        fields: paymentResults,
      };
      callback(null, gestioneObject);
    })
    .catch((err) => {
      callback(err, null);
    });
}

function updateCostiGestione(idGestione, data, callback) {
  const { name, payments } = data;

  db.run(
    'UPDATE gestione SET name = ? WHERE id_gestione = ?',
    [name, idGestione],
    function (err) {
      if (err) {
        console.error('Error updating gestione in database:', err);
        callback(err, null);
      } else {
        // Delete existing payments for this fornitore
        db.run(
          'DELETE FROM costi WHERE id_gestione = ?',
          [idGestione],
          function (err) {
            if (err) {
              console.error('Error deleting existing payments:', err);
              callback(err, null);
            } else {
              // Insert new payments
              const paymentQueries = payments.map(payment => {
                return new Promise((resolve, reject) => {
                  db.run(
                    'INSERT INTO costi (id_gestione, creation_date, amount, cost_type, cost_number, cost_emission_date, expired_date, payment_state, payment_type, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [idGestione, payment.creationDate, payment.amount, payment.costType, payment.costNumber, payment.emissionDate, payment.expiredDate, payment.paymentState, payment.paymentType, payment.season],
                    function (err) {
                      if (err) {
                        reject(err);
                      } else {
                        resolve({
                          idCosto: this.lastID,
                          creationDate: payment.creationDate,
                          amount: payment.amount,
                          costType: payment.costType,
                          costNumber: payment.costNumber,
                          emissionDate: payment.emissionDate,
                          expiredDate: payment.expiredDate,
                          paymentState: payment.paymentState,
                          paymentType: payment.paymentType,
                          season: payment.season
                        });
                      }
                    }
                  );
                });
              });

              Promise.all(paymentQueries)
                .then(paymentResults => {
                  const gestioneObject = {
                    idGestione: idGestione,
                    name: name,
                    fields: paymentResults
                  };
                  callback(null, gestioneObject);
                })
                .catch(err => {
                  callback(err, null);
                });
            }
          }
        );
      }
    }
  );
}

function deleteCostiGestione(idGestione, currentSeason, callback) {

  const deleteQuery = `
    DELETE FROM costi
    WHERE id_gestione = ? AND season = ?
  `;

  db.run(deleteQuery, [idGestione, currentSeason], function (err) {
    if (err) {
      console.error('Error deleting costs for the current season:', err);
      callback(err, null);
      return;
    }

    callback(null, { deletedRows: this.changes });
  }
  );
}

module.exports = {
  getCostiGestione,
  addCostiGestione,
  updateCostiGestione,
  deleteCostiGestione
};
