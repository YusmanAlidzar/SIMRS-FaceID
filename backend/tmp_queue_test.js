const { getConnection } = require('./config/db');

(async () => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM patients WHERE id = ?', ['3273012903930005']);
    console.log('patients', rows);

    const [count] = await conn.query('SELECT COUNT(*) as count FROM visits WHERE poliklinik_id = ? AND DATE(visit_date) = ?', ['poly-umum', '2026-06-07']);
    console.log('count', count[0]);

    const ticketId = 'POLY-UMUM-20260607-001';
    const visitTime = new Date().toTimeString().split(' ')[0];
    const [result] = await conn.query(
      'INSERT INTO visits (ticket_id, patient_id, poliklinik_id, queue_number, visit_date, visit_time, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [ticketId, '3273012903930005', 'poly-umum', '001', '2026-06-07', visitTime, 'Menunggu']
    );
    console.log('insert result', result);
  } catch (err) {
    console.error('ERROR', err);
  }
})();
