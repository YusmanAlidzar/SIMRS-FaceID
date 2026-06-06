const { getConnection } = require('../config/db');

// ==================== GENERATE QUEUE TICKET ====================

// Generate nomor antrean baru untuk visit
const generateQueueTicket = async (req, res) => {
  try {
    const { patient_id, poliklinik_id, visit_date } = req.body;

    if (!patient_id || !poliklinik_id || !visit_date) {
      return res.status(400).json({ error: 'Patient ID, poliklinik ID, and visit date required' });
    }

    const connection = await getConnection();
    try {
      // Get patient info
      const [patients] = await connection.query(
        'SELECT name, gender, age FROM patients WHERE id = ?',
        [patient_id]
      );

      if (patients.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      const patient = patients[0];

      // Get today's queue count for this poliklinik
      const [queueStats] = await connection.query(
        'SELECT COUNT(*) as count FROM visits WHERE poliklinik_id = ? AND DATE(visit_date) = ?',
        [poliklinik_id, visit_date]
      );

      const queueNumber = (queueStats[0].count + 1).toString().padStart(3, '0');
      const ticketId = `${poliklinik_id.toUpperCase()}-${visit_date.replace(/-/g, '')}-${queueNumber}`;
      const visitTime = new Date().toTimeString().split(' ')[0]; // Current time

      // Create visit record
      const [result] = await connection.query(
        `INSERT INTO visits (id, patient_id, poliklinik_id, visit_time, visit_date, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [ticketId, patient_id, poliklinik_id, visitTime, visit_date, 'Antri']
      );

      // Get poliklinik info
      const [polikliniks] = await connection.query(
        'SELECT name, doctor_name FROM poliklinik WHERE id = ?',
        [poliklinik_id]
      );

      const poliklinik = polikliniks[0] || {};

      res.status(201).json({
        success: true,
        message: 'Queue ticket generated successfully',
        ticket: {
          ticketId: ticketId,
          queueNumber: queueNumber,
          patientName: patient.name,
          gender: patient.gender,
          age: patient.age,
          poliklinik: poliklinik.name,
          doctor: poliklinik.doctor_name,
          visitDate: visit_date,
          visitTime: visitTime,
          status: 'Antri'
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Generate queue ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== GET QUEUE INFORMATION ====================

// Get queue list for specific poliklinik and date
const getQueueByPoliklinik = async (req, res) => {
  try {
    const { poliklinik_id, date } = req.params;

    if (!poliklinik_id || !date) {
      return res.status(400).json({ error: 'Poliklinik ID and date required' });
    }

    const connection = await getConnection();
    try {
      const [visits] = await connection.query(`
        SELECT 
          v.id as ticketId,
          SUBSTRING(v.id, -3) as queueNumber,
          p.name as patientName,
          p.gender,
          p.age,
          v.visit_time as time,
          v.status,
          pk.name as poliklinik,
          pk.doctor_name as doctor
        FROM visits v
        LEFT JOIN patients p ON v.patient_id = p.id
        LEFT JOIN poliklinik pk ON v.poliklinik_id = pk.id
        WHERE v.poliklinik_id = ? AND DATE(v.visit_date) = ?
        ORDER BY v.visit_time ASC
      `, [poliklinik_id, date]);

      res.json({
        poliklinik: poliklinik_id,
        date: date,
        totalQueue: visits.length,
        queues: visits
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get queue by poliklinik error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get current queue (today's queue)
const getCurrentQueue = async (req, res) => {
  try {
    const connection = await getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];

      const [visits] = await connection.query(`
        SELECT 
          v.id as ticketId,
          SUBSTRING(v.id, -3) as queueNumber,
          p.name as patientName,
          p.gender,
          p.age,
          v.visit_time as time,
          v.status,
          pk.name as poliklinik,
          pk.doctor_name as doctor
        FROM visits v
        LEFT JOIN patients p ON v.patient_id = p.id
        LEFT JOIN poliklinik pk ON v.poliklinik_id = pk.id
        WHERE DATE(v.visit_date) = ?
        ORDER BY pk.name, v.visit_time ASC
      `, [today]);

      // Group by poliklinik
      const queuesByPoliklinik = {};
      visits.forEach(visit => {
        if (!queuesByPoliklinik[visit.poliklinik]) {
          queuesByPoliklinik[visit.poliklinik] = [];
        }
        queuesByPoliklinik[visit.poliklinik].push(visit);
      });

      res.json({
        date: today,
        totalQueue: visits.length,
        byPoliklinik: queuesByPoliklinik
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get current queue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get patient's ticket info
const getPatientTicket = async (req, res) => {
  try {
    const { ticket_id } = req.params;

    if (!ticket_id) {
      return res.status(400).json({ error: 'Ticket ID required' });
    }

    const connection = await getConnection();
    try {
      const [visits] = await connection.query(`
        SELECT 
          v.id as ticketId,
          SUBSTRING(v.id, -3) as queueNumber,
          p.name as patientName,
          p.gender,
          p.age,
          p.phone,
          v.visit_time as time,
          v.visit_date as date,
          v.status,
          pk.name as poliklinik,
          pk.doctor_name as doctor
        FROM visits v
        LEFT JOIN patients p ON v.patient_id = p.id
        LEFT JOIN poliklinik pk ON v.poliklinik_id = pk.id
        WHERE v.id = ?
      `, [ticket_id]);

      if (visits.length === 0) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json(visits[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get patient ticket error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== UPDATE QUEUE STATUS ====================

// Update visit/queue status (e.g., Antri -> Pemeriksaan -> Selesai)
const updateQueueStatus = async (req, res) => {
  try {
    const { ticket_id, status } = req.body;

    if (!ticket_id || !status) {
      return res.status(400).json({ error: 'Ticket ID and status required' });
    }

    const validStatuses = ['Antri', 'Pemeriksaan', 'Selesai', 'Menunggu', 'Gawat', 'Diperiksa'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const connection = await getConnection();
    try {
      const [result] = await connection.query(
        'UPDATE visits SET status = ? WHERE id = ?',
        [status, ticket_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      res.json({ 
        success: true, 
        message: `Queue status updated to ${status}`,
        ticketId: ticket_id
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update queue status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== QUEUE STATISTICS ====================

// Get queue statistics for today
const getQueueStats = async (req, res) => {
  try {
    const connection = await getConnection();
    try {
      const today = new Date().toISOString().split('T')[0];

      const [totalQueue] = await connection.query(
        'SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = ?',
        [today]
      );

      const [completed] = await connection.query(
        'SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = ? AND status = "Selesai"',
        [today]
      );

      const [pending] = await connection.query(
        'SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = ? AND status IN ("Antri", "Menunggu")',
        [today]
      );

      const [inProcess] = await connection.query(
        'SELECT COUNT(*) as count FROM visits WHERE DATE(visit_date) = ? AND status IN ("Pemeriksaan", "Diperiksa")',
        [today]
      );

      const [byPoliklinik] = await connection.query(`
        SELECT 
          pk.name as poliklinik,
          COUNT(v.id) as total,
          SUM(CASE WHEN v.status = 'Selesai' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN v.status IN ('Antri', 'Menunggu') THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN v.status IN ('Pemeriksaan', 'Diperiksa') THEN 1 ELSE 0 END) as inProcess
        FROM visits v
        LEFT JOIN poliklinik pk ON v.poliklinik_id = pk.id
        WHERE DATE(v.visit_date) = ?
        GROUP BY pk.id, pk.name
      `, [today]);

      res.json({
        date: today,
        summary: {
          total: totalQueue[0].count,
          completed: completed[0].count,
          pending: pending[0].count,
          inProcess: inProcess[0].count
        },
        byPoliklinik: byPoliklinik
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get queue stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  generateQueueTicket,
  getQueueByPoliklinik,
  getCurrentQueue,
  getPatientTicket,
  updateQueueStatus,
  getQueueStats
};
