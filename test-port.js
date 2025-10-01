const http = require('http');

// Make a request to our server
const options = {
  hostname: 'localhost',
  port: 7000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  res.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
  });
  
  res.on('end', () => {
    console.log('Request completed');
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.end();