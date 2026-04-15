const http = require('http');

const data = JSON.stringify({
  title: "Test Payload",
  image: "x".repeat(2 * 1024 * 1024), // 2MB string
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/status', // We just want to see if the body-parser rejects it before the route
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', (d) => process.stdout.write(d));
});

req.on('error', (e) => console.error(`problem with request: ${e.message}`));
req.write(data);
req.end();
