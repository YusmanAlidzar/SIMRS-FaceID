const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');
function run(sql) {
  return new Promise((resolve, reject) => db.all(sql, (err, rows) => err ? reject(err) : resolve(rows)));
}
(async () => {
  try {
    console.log('poliklinik ids:');
    console.log(await run('SELECT id, name FROM poliklinik ORDER BY id'));
    console.log('visit table info:');
    console.log(await run('PRAGMA table_info(visits)'));
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
})();
