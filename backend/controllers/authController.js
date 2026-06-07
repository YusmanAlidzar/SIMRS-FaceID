const { getConnection } = require('../config/db');

// ==================== LOGIN DENGAN FACE ID / MANUAL ====================

// Login dengan username & password (manual)
const loginManual = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const connection = await getConnection();
    try {
      const [users] = await connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      // Note: In production, use bcrypt for password hashing
      if (user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== HELPERS ====================

const normalizeGender = (gender) => {
  if (!gender || typeof gender !== 'string') return null;
  const normalized = gender.trim().toLowerCase();
  if (['l', 'laki-laki', 'laki laki', 'male'].includes(normalized)) {
    return 'Laki-laki';
  }
  if (['p', 'perempuan', 'female', 'wanita'].includes(normalized)) {
    return 'Perempuan';
  }
  return null;
};

const parseAgeValue = (age) => {
  if (age == null) return null;
  const numericAge = Number(age);
  if (!Number.isNaN(numericAge)) return numericAge;
  const match = String(age).match(/\d+/);
  return match ? Number(match[0]) : null;
};

const calculateAgeFromBirthDate = (birthDate) => {
  if (!birthDate) return null;
  const parsedDate = new Date(birthDate);
  if (Number.isNaN(parsedDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - parsedDate.getFullYear();
  const monthDiff = today.getMonth() - parsedDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedDate.getDate())) {
    age -= 1;
  }
  return age >= 0 ? age : null;
};

// ==================== REGISTER PASIEN DENGAN FACE ID ====================

// Register pasien baru dengan data + Face encoding
const registerPatientWithFace = async (req, res) => {
  try {
    const { id, name, nik, gender, age, birth_date, address, phone, photo_url, face_encoding } = req.body;

    if (!id || !name || !gender) {
      return res.status(400).json({ error: 'Missing required fields: id, name, gender' });
    }

    if (!face_encoding) {
      return res.status(400).json({ error: 'Face encoding is required' });
    }

    const normalizedGender = normalizeGender(gender);
    if (!normalizedGender) {
      return res.status(400).json({ error: 'Invalid gender value' });
    }

    const computedAge = age || calculateAgeFromBirthDate(birth_date);

    const connection = await getConnection();
    try {
      // Check if patient already exists
      const [existingPatient] = await connection.query(
        'SELECT id FROM patients WHERE id = ? OR nik = ?',
        [id, nik]
      );

      if (existingPatient.length > 0) {
        return res.status(409).json({ error: 'Patient already exists' });
      }

      const [result] = await connection.query(
        `INSERT INTO patients (id, name, nik, gender, age, birth_date, address, phone, photo_url, face_encoding, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, name, nik, normalizedGender, computedAge, birth_date, address, phone, photo_url, face_encoding, 'Outpatient']
      );

      res.status(201).json({
        success: true,
        message: 'Patient registered successfully with Face ID',
        patientId: id
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== REGISTER PASIEN TANPA FACE ID ====================

const registerPatient = async (req, res) => {
  try {
    const {
      id,
      name,
      nik,
      gender,
      age,
      birth_date,
      tanggalLahir,
      address,
      phone,
      photo_url,
      face_encoding,
    } = req.body;

    const patientId = id || nik;
    const patientName = name;
    const patientNik = nik || patientId;
    const patientGender = normalizeGender(gender);
    const birthDateValue = birth_date || tanggalLahir;
    const computedAge = parseAgeValue(age) || calculateAgeFromBirthDate(birthDateValue);

    if (!patientId || !patientName || !patientGender) {
      return res.status(400).json({ error: 'Missing required fields: id/nik, name, gender' });
    }

    const connection = await getConnection();
    try {
      const [existingPatient] = await connection.query(
        'SELECT id FROM patients WHERE id = ? OR nik = ?',
        [patientId, patientNik]
      );

      if (existingPatient.length > 0) {
        return res.status(409).json({ error: 'Patient already exists' });
      }

      await connection.query(
        `INSERT INTO patients (id, name, nik, gender, age, birth_date, address, phone, photo_url, face_encoding, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          patientId,
          patientName,
          patientNik,
          patientGender,
          computedAge,
          birthDateValue,
          address,
          phone,
          photo_url,
          face_encoding || null,
          'Outpatient',
        ],
      );

      res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        patientId,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register patient error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== VERIFIKASI FACE ID ====================

// Verifikasi wajah pasien untuk check-in/login
const verifyFaceID = async (req, res) => {
  try {
    const { face_encoding, tolerance = 0.6 } = req.body;

    if (!face_encoding) {
      return res.status(400).json({ error: 'Face encoding required' });
    }

    const connection = await getConnection();
    try {
      // Get all patients with face encoding
      const [patients] = await connection.query(
        'SELECT id, name, gender, age, photo_url FROM patients WHERE face_encoding IS NOT NULL'
      );

      if (patients.length === 0) {
        return res.status(404).json({ error: 'No registered patients found' });
      }

      // Simple distance calculation (Euclidean distance)
      // In production, use proper face recognition library like face-api.js or face_recognition
      let bestMatch = null;
      let bestDistance = tolerance;

      for (const patient of patients) {
        // Calculate similarity (simple mock - in production use proper algorithm)
        const distance = calculateFaceDistance(face_encoding, patient.face_encoding);
        
        if (distance < bestDistance) {
          bestDistance = distance;
          bestMatch = patient;
        }
      }

      if (!bestMatch) {
        return res.status(401).json({ 
          success: false,
          message: 'No matching face found',
          confidence: 0 
        });
      }

      res.json({
        success: true,
        message: 'Face matched successfully',
        patient: bestMatch,
        confidence: (1 - bestDistance) * 100
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Verify face error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update face encoding for patient
const updateFaceEncoding = async (req, res) => {
  try {
    const { patient_id, face_encoding } = req.body;

    if (!patient_id || !face_encoding) {
      return res.status(400).json({ error: 'Patient ID and face encoding required' });
    }

    const connection = await getConnection();
    try {
      const [result] = await connection.query(
        'UPDATE patients SET face_encoding = ? WHERE id = ?',
        [face_encoding, patient_id]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.json({ 
        success: true, 
        message: 'Face encoding updated successfully' 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update face encoding error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get patient info by ID
const getPatientInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    try {
      const [patients] = await connection.query(
        'SELECT id, name, nik, gender, age, address, phone, status, registered_date FROM patients WHERE id = ?',
        [id]
      );

      if (patients.length === 0) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      res.json(patients[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get patient info error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all patients (admin only)
const getAllPatients = async (req, res) => {
  try {
    const connection = await getConnection();
    try {
      const [patients] = await connection.query(
        'SELECT id, name, nik, gender, age, address, phone, status, registered_date FROM patients'
      );
      res.json(patients);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Search patients
const searchPatients = async (req, res) => {
  try {
    const { query } = req.params;
    const connection = await getConnection();
    try {
      const [patients] = await connection.query(
        'SELECT id, name, nik, gender, age, address, phone, status FROM patients WHERE name LIKE ? OR nik LIKE ? LIMIT 20',
        [`%${query}%`, `%${query}%`]
      );
      res.json(patients);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// ==================== HELPER FUNCTION ====================

// Calculate simple face distance (mock - for production use proper library)
const calculateFaceDistance = (encoding1, encoding2) => {
  try {
    const enc1 = JSON.parse(typeof encoding1 === 'string' ? encoding1 : JSON.stringify(encoding1));
    const enc2 = JSON.parse(typeof encoding2 === 'string' ? encoding2 : JSON.stringify(encoding2));
    
    if (!Array.isArray(enc1) || !Array.isArray(enc2)) {
      return 1; // Maximum distance if not valid arrays
    }

    // Euclidean distance
    const distance = Math.sqrt(
      enc1.reduce((sum, val, i) => sum + Math.pow(val - (enc2[i] || 0), 2), 0)
    );
    
    // Normalize to 0-1 range
    return Math.min(distance / 100, 1);
  } catch (error) {
    console.error('Distance calculation error:', error);
    return 1;
  }
};

module.exports = {
  loginManual,
  registerPatientWithFace,
  registerPatient,
  verifyFaceID,
  updateFaceEncoding,
  getPatientInfo,
  getAllPatients,
  searchPatients
};
