const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// const dbPath = path.join(__dirname, 'Ciane13-database.sqlite');
const dbPath = path.join(process.cwd(), 'Ciane13-database.sqlite');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {

  db.run('PRAGMA foreign_keys = ON;');

  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT, 
    usertype TEXT,
    username TEXT,
    password TEXT,
    creation_date TEXT,
    last_modification_date TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Gestione (
    id_gestione INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT,
    creation_date TEXT,
    last_modification_date TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS Fornitori (
    id_fornitore INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT,
    address TEXT,
    email TEXT,
    phone TEXT,
    partiva_iva TEXT,
    creation_date TEXT,
    last_modification_date TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Costi (
    id_costo INTEGER PRIMARY KEY AUTOINCREMENT, 
    payment_type TEXT,
    season TEXT,
    creation_date TEXT,
    last_modification_date TEXT,
    expired_date TEXT,

    
    cost_type TEXT,
    cost_number TEXT,
    cost_emission_date TEXT,


    amount TEXT,
    payment_state TEXT,
    id_fornitore INTEGER,
    id_gestione INTEGER,
    FOREIGN KEY (id_fornitore) REFERENCES Fornitori(id_fornitore),
    FOREIGN KEY (id_gestione) REFERENCES Gestione(id_gestione)
  )`);

});

module.exports = db;
