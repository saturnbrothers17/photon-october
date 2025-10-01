const http = require('http');

// Test the registration page
const registerOptions = {
  hostname: 'localhost',
  port: 7000,
  path: '/auth/register',
  method: 'GET'
};

const registerReq = http.request(registerOptions, (res) => {
  console.log(`Registration Page Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Registration page contains required fields:`);
    console.log(`- Photon ID field: ${data.includes('Photon ID') ? 'YES' : 'NO'}`);
    console.log(`- Phone Number field: ${data.includes('Phone Number') ? 'YES' : 'NO'}`);
    console.log(`- Class field: ${data.includes('Class') ? 'YES' : 'NO'}`);
    console.log(`- Course field: ${data.includes('Course') ? 'YES' : 'NO'}`);
    console.log(`- Photon Password field: ${data.includes('Photon Password') ? 'YES' : 'NO'}`);
  });
});

registerReq.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

registerReq.end();

// Test the login page
const loginOptions = {
  hostname: 'localhost',
  port: 7000,
  path: '/auth/login',
  method: 'GET'
};

const loginReq = http.request(loginOptions, (res) => {
  console.log(`\nLogin Page Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Login page contains required fields:`);
    console.log(`- Photon ID field: ${data.includes('Photon ID') ? 'YES' : 'NO'}`);
    console.log(`- Photon Password field: ${data.includes('Photon Password') ? 'YES' : 'NO'}`);
  });
});

loginReq.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

loginReq.end();