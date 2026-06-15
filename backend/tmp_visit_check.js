const { getConnection } = require('./config/db');

(async () => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM visits WHERE patient_id = ? ORDER BY id DESC LIMIT 5', ['3273012903930005']);
    console.log(rows);
  } catch (err) {
    console.error(err);
  }
})();
