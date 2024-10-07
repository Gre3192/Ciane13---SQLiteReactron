const db = require('../database');
const filterCostiAPI = require('./UtilsAPI/filterCostiAPI');

function getCosti(callback, filterCosti = {}) {
  let query = `
    SELECT 
    c.id_costo               as idCosto, 
    c.creation_date          as creationDate, 
    c.amount                 as amount, 
    c.expired_date           as expiredDate, 
    c.cost_type              as costType, 
    c.cost_number            as costNumber, 
    c.cost_emission_date     as emissionDate, 
    c.payment_state          as paymentState, 
    c.payment_type           as paymentType
    FROM costi c`;

  const { filterQuery, params } = filterCostiAPI(filterCosti);
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

function addCosti(data, callback) {

  const { name, type, creationDate, costType, costNumber, emissionDate, amount, expiredDate, paymentState, paymentType } = data;

  const query = `
    INSERT INTO costi (name, type, creation_date, cost_type, cost_number, cost_emission_date, amount, expired_date, payment_state, payment_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [name, type, creationDate, costType, costNumber, emissionDate, amount, expiredDate, paymentState, paymentType], function (err) {
    if (err) {
      console.error('Error adding costi to database:', err);
      callback(err, null);
      return;
    }

    // Return the newly added costi
    const newCosti = {
      idCosto: this.lastID,
      name,
      type,
      creationDate,
      costType,
      costNumber,
      emissionDate,
      amount,
      expiredDate,
      paymentState,
      paymentType
    };

    callback(null, newCosti);
  });
}

function updateCosti(idCosto, data, callback) {
  const { name, type, creationDate, costType, costNumber, emissionDate, amount, expiredDate, paymentState, paymentType } = data;

  const query = `
    UPDATE costi
    SET name = ?, type = ?, creation_date = ?, amount = ?, cost_type = ?, cost_number = ?, cost_emission_date = ?, expired_date = ?, payment_state = ?, payment_type = ?
    WHERE id_costo = ?
  `;

  db.run(query, [name, type, creationDate, amount, costType, costNumber, emissionDate, expiredDate, paymentState, paymentType, idCosto], function (err) {
    if (err) {
      console.error('Error updating costi in database:', err);
      callback(err, null);
      return;
    }

    // Return the updated costi
    const updatedCosti = {
      idCosto,
      name,
      type,
      creationDate,
      costType,
      costNumber,
      emissionDate,
      amount,
      expiredDate,
      paymentState,
      paymentType
    };

    callback(null, updatedCosti);
  });
}

function deleteCosti(idCosto, callback) {
  const query = `
    DELETE FROM costi
    WHERE id_costo = ?
  `;

  db.run(query, [idCosto], function (err) {
    if (err) {
      console.error('Error deleting costi from database:', err);
      callback(err, null);
      return;
    }

    callback(null, { idCosto });
  });
}

module.exports = {
  getCosti,
  addCosti,
  updateCosti,
  deleteCosti
};
