const create = () => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('db connection error:', err.message);
    }
    });

    db.run(`CREATE TABLE IF NOT EXISTS systems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        shortName TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS periyods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        stokNo TEXT,
        parcaNo TEXT,
        miktar TEXT,
        sarfYeri TEXT,
        tedarikYeri TEXT,
        fiyati FLOAT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS technician (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        title TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS officer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        title TEXT
    )`);
}

export default { create }
