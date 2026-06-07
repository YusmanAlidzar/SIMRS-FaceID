const queueController = require('./controllers/queueController');

const req = {
  body: {
    patient_id: '3273012903930005',
    poliklinik_id: 'poly-umum',
    visit_date: '2026-06-07'
  }
};

const res = {
  status(code) {
    this.code = code;
    return this;
  },
  json(payload) {
    console.log('RES status', this.code, 'payload', payload);
  }
};

(async () => {
  try {
    await queueController.generateQueueTicket(req, res);
  } catch (err) {
    console.error('UNCAUGHT', err);
  }
})();
