const fetch = global.fetch || require('node-fetch');
(async () => {
  try {
    const response = await fetch('http://localhost:5000/api/queue/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: '3273012903930005',
        poliklinik_id: 'poly-umum',
        visit_date: '2026-06-07'
      })
    });
    const data = await response.text();
    console.log('STATUS', response.status);
    console.log('BODY', data);
  } catch (err) {
    console.error(err);
  }
})();
