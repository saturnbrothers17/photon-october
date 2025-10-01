const http = require('http');

// Make a request to our student corner page
const options = {
  hostname: 'localhost',
  port: 7000,
  path: '/student-corner',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Received ${data.length} bytes of data.`);
    if (data.includes('loginModal') || data.includes('Access Student Resources')) {
      console.log('Login popup is present in the response');
    } else {
      console.log('Login popup not found in the response');
    }
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.end();