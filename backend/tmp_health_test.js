const http = require('http');
const req = http.get('http://127.0.0.1:5000/api/health', (res) => {
  console.log('STATUS', res.statusCode);
  res.on('data', (chunk) => process.stdout.write(chunk.toString()));
  res.on('end', () => process.exit(0));
});
req.on('error', (err) => {
  console.error('ERR', err.message);
  process.exit(1);
});
