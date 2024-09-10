const create = () => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('db connection error:', err.message);
    }
    });

    db.run(`CREATE TABLE IF NOT EXISTS systems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        deleted INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        deleted INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS sides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        shortName TEXT,
        deleted INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS periyods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        deleted INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS stocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        stokNo TEXT,
        parcaNo TEXT,
        miktar TEXT,
        sarfYeri TEXT,
        tedarikYeri TEXT,
        fiyati FLOAT,
        deleted INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS technicians (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        title TEXT,
        deleted INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS officers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        title TEXT,
        deleted INTEGER DEFAULT 0
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS maintenances (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      birlik INTEGER,
      device INTEGER,
      kontrolNo TEXT,
      baslangicTarihi DATETIME,
      bitisTarihi DATETIME,
      aciklama TEXT,
      dokuman TEXT,
      periyod INTEGER,
      personel INTEGER,
      yonetici INTEGER,
      malzemeler TEXT,
      deleted INTEGER DEFAULT 0

    )`);

    db.run(`CREATE TABLE IF NOT EXISTS faults (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      birlik INTEGER,
      sistem INTEGER,
      kontrolNo TEXT,
      arizaNo TEXT,
      baslangicTarihi DATETIME,
      bitisTarihi DATETIME,
      aciklama TEXT,
      dokuman TEXT,
      ariza TEXT,
      personel INTEGER,
      yonetici INTEGER,
      malzemeler TEXT,
      deleted INTEGER DEFAULT 0

    )`);

    db.run(`CREATE TABLE IF NOT EXISTS calender (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT,
        name TEXT,
        
      )`);

    db.run(`CREATE TABLE IF NOT EXISTS pass (
      password TEXT,
      deleted INTEGER DEFAULT 0
    )`,()=>{
        db.get(`SELECT COUNT(*) as count FROM pass`, (err, row) => {
            if (err) {
                console.error('Error checking pass table:', err.message);
            } else if (row.count === 0) {
                db.run(`INSERT INTO pass (password) VALUES (?)`, ['Z2FsYWRyaWVs'], (err) => {
                    if (err) {
                        console.error('Error inserting into pass table:', err.message);
                    }
                });
            }
        });
    })

    
}

export default { create }
