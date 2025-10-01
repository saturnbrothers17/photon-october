// Simple test to verify API key
const https = require('https');

// Test API key with a simple request
const apiKey = 'AIzaSyB2TRBXqCPOTFS0kK6e8IIfLoiQE8FGEnc';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Testing API key...');

https.get(url, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response Headers:', res.headers);
    console.log('Response Body:', data);
    
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.models) {
        console.log('\nAvailable models:');
        jsonData.models.forEach(model => {
          console.log(`- ${model.name}: ${model.displayName || 'No display name'}`);
        });
      }
    } catch (e) {
      console.log('Could not parse JSON response');
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});