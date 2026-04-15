const http = require('http');

const data = JSON.stringify({
  maintenanceMode: true
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/config',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    // Note: This won't work if the route has 'protect' and 'admin' middleware unless I have a token
  }
};

console.log('Testing PUT /api/config without token (expecting 401)...');
const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => console.error(`problem with request: ${e.message}`));
req.write(data);
req.end();
