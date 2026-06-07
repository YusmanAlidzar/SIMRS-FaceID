const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const schemaPath = path.resolve(__dirname, '../database/schema.sql');

const db = new sqlite3.Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');

// Mengeksekusi seluruh isi schema.sql ke dalam SQLite
db.exec(schema, (err) => {
    if (err) {
        console.error("❌ Gagal membuat tabel SQLite:", err.message);
    } else {
        console.log("✅ Database SQLite & Tabel berhasil disiapkan!");
    }
    db.close();
});