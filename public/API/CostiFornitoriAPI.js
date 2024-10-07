const db = require('../database');
const filterCostiAPI = require('./UtilsAPI/filterCostiAPI');
const filterFornitoriAPI = require('./UtilsAPI/filterFornitoriAPI');

function getCostiFornitori(callback, filterCosti = {}, filterFornitori = {}, page = 1, pageSize = 1000) {
  let queryFornitori = `
    SELECT 
      f.id_fornitore     as idFornitore, 
      f.name             as fornitore, 
      f.partiva_iva      as pIva
    FROM fornitori f
  `;

  const { filterQuery: filterQueryFornitori, params: paramsFornitori } = filterFornitoriAPI(filterFornitori);

  // Combina i filtri per i fornitori
  queryFornitori += filterQueryFornitori;

  // Aggiungi la paginazione per i fornitori
  const offset = (page - 1) * pageSize;
  queryFornitori += ` LIMIT ? OFFSET ?`;

  // Unisci i parametri dei filtri per i fornitori e aggiungi quelli della paginazione
  const params = [...paramsFornitori, pageSize, offset];

  db.all(queryFornitori, params, (err, fornitori) => {
    if (err) {
      console.error('Error fetching data from database:', err);
      callback(err, null);
      return;
    }

    if (fornitori.length === 0) {
      callback(null, []);
      return;
    }

    // Costruire una lista di idFornitore per la query dei costi
    const fornitoriIds = fornitori.map(f => f.idFornitore);

    let queryCosti = `
      SELECT 
        f.id_fornitore                as idFornitore, 
        f.name                        as fornitore, 
        f.partiva_iva                 as pIva, 
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
      JOIN fornitori f ON f.id_fornitore = c.id_fornitore
      WHERE f.id_fornitore IN (${fornitoriIds.map(() => '?').join(',')})
    `;

    const { filterQuery: filterQueryCosti, params: paramsCosti } = filterCostiAPI(filterCosti);

    // Aggiungi i filtri per i costi
    if (filterQueryCosti) {
      queryCosti += ` AND ${filterQueryCosti.slice(7)}`; // Rimuovi il prefisso 'WHERE' da filterQueryCosti e aggiungi 'AND'
    }

    // Aggiungi la clausola ORDER BY per ordinare i costi per expired_date
    queryCosti += ` ORDER BY c.expired_date ASC`;

    const costiParams = [...fornitoriIds, ...paramsCosti];

    db.all(queryCosti, costiParams, (err, rows) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        callback(err, null);
        return;
      }

      const data = {};

      // Inserisci solo i fornitori che hanno costi associati
      rows.forEach(row => {
        if (row.idCosto) {
          if (!data[row.idFornitore]) {
            data[row.idFornitore] = {
              idFornitore: row.idFornitore,
              name: row.fornitore,
              pIva: row.pIva,
              fields: []
            };
          }
          data[row.idFornitore].fields.push({
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

      const result = Object.values(data);
      callback(null, result);
    });
  });
}

function addCostiFornitori(data, callback) {

  const { name, idFornitore, pIva, payments } = data;

  if (!idFornitore) {
    callback(new Error('Manca l\'ID del fornitore'), null);
    return;
  }

  const paymentQueries = payments.map(payment => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO costi (id_fornitore, amount, expired_date, cost_type, cost_number, cost_emission_date, last_modification_date, creation_date, payment_state, payment_type, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idFornitore, payment.amount, payment.expiredDate, payment.costType, payment.costNumber, payment.emissionDate, new Date(), new Date(), payment.paymentState, payment.paymentType, payment.season],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              idCosto: this.lastID,
              amount: payment.amount,
              expiredDate: payment.expiredDate,
              paymentState: payment.paymentState,
              costType: payment.costType,
              costNumber: payment.costNumber,
              emissionDate: payment.emissionDate,
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
      const fornitoreObject = {
        name: name,
        idFornitore: idFornitore,
        pIva: pIva,
        fields: paymentResults,
      };
      callback(null, fornitoreObject);
    })
    .catch((err) => {
      callback(err, null);
    });
}

function updateCostiFornitori(idFornitore, data, callback) {

  const { name, payments, pIva } = data;

  db.run('UPDATE fornitori SET name = ? WHERE id_fornitore = ?', [name, idFornitore],
    function (err) {
      if (err) {
        console.error('Error updating fornitore in database:', err);
        callback(err, null);
      } else {
        // Delete existing payments for this fornitore
        db.run('DELETE FROM costi WHERE id_fornitore = ?', [idFornitore],
          function (err) {
            if (err) {
              console.error('Error deleting existing payments:', err);
              callback(err, null);
            } else {
              // Insert new payments
              const paymentQueries = payments.map(payment => {
                return new Promise((resolve, reject) => {
                  db.run(
                    'INSERT INTO costi (id_fornitore, creation_date, amount,cost_type, cost_number, cost_emission_date, expired_date, payment_state, payment_type, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,?)',
                    [idFornitore, payment.creationDate, payment.amount, payment.costType, payment.costNumber, payment.emissionDate, payment.expiredDate, payment.paymentState, payment.paymentType, payment.season],
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
                  const fornitoreObject = {
                    idFornitore: idFornitore,
                    name: name,
                    pIva: pIva,
                    fields: paymentResults
                  };
                  callback(null, fornitoreObject);
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

function deleteCostiFornitori(idFornitore, currentSeason, callback) {

  const deleteQuery = `
    DELETE FROM costi
    WHERE id_fornitore = ? AND season = ?
  `;

  db.run(deleteQuery, [idFornitore, currentSeason], function (err) {
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
  getCostiFornitori,
  addCostiFornitori,
  updateCostiFornitori,
  deleteCostiFornitori
};

