const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const queueController = require('../controllers/queueController');

// ==================== AUTHENTICATION ROUTES ====================

// Manual login (username & password)
router.post('/auth/login', authController.loginManual);

// Register patient with Face ID
router.post('/auth/register-face', authController.registerPatientWithFace);

// Verify Face ID
router.post('/auth/verify-face', authController.verifyFaceID);

// Update face encoding
router.post('/auth/update-face', authController.updateFaceEncoding);

// ==================== PATIENT ROUTES ====================

// Get patient info by ID
router.get('/patients/:id', authController.getPatientInfo);

// Get all patients (admin)
router.get('/patients', authController.getAllPatients);

// Search patients
router.get('/patients/search/:query', authController.searchPatients);

// ==================== QUEUE/VISIT ROUTES ====================

// Generate queue ticket
router.post('/queue/generate', queueController.generateQueueTicket);

// Get current queue (today)
router.get('/queue/current', queueController.getCurrentQueue);

// Get queue by poliklinik and date
router.get('/queue/:poliklinik_id/:date', queueController.getQueueByPoliklinik);

// Get patient's ticket info
router.get('/queue/ticket/:ticket_id', queueController.getPatientTicket);

// Update queue status
router.put('/queue/update-status', queueController.updateQueueStatus);

// Get queue statistics
router.get('/queue/stats/today', queueController.getQueueStats);

// ==================== HEALTH CHECK ====================

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SIMRS Face ID API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
