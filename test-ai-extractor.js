const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function testAIExtractor() {
  try {
    // Dynamically import node-fetch
    const { default: fetch } = await import('node-fetch');
    
    console.log('Logging in as faculty user...');
    
    // Login as faculty user first
    const loginResponse = await fetch('http://localhost:7000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'photon_id=jp7%40photon&password=jp7%40photon',
      redirect: 'manual' // Don't follow redirects
    });
    
    // Get cookies from login response
    const cookies = loginResponse.headers.raw()['set-cookie'] || [];
    const cookieHeader = cookies.map(cookie => cookie.split(';')[0]).join('; ');
    
    console.log('Login response status:', loginResponse.status);
    
    if (loginResponse.status !== 302) {
      console.log('❌ Login failed');
      return;
    }
    
    console.log('✅ Login successful');
    
    // Path to the new WhatsApp image
    const imagePath = path.join(__dirname, 'WhatsApp Image 2025-09-23 at 9.33.40 PM.jpeg');
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log('❌ Image file not found:', imagePath);
      return;
    }
    
    console.log('Testing AI Question Extractor with WhatsApp image...');
    
    // Create form data
    const form = new FormData();
    form.append('questionImage', fs.createReadStream(imagePath));
    
    // Send POST request to the AI extractor with authentication cookies
    const response = await fetch('http://localhost:7000/ai-extractor/upload', {
      method: 'POST',
      body: form,
      headers: {
        'Cookie': cookieHeader
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Successfully extracted questions:');
      console.log(JSON.stringify(result.questions, null, 2));
    } else {
      console.log('❌ Error extracting questions:');
      console.log(result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Stack trace:', error.stack);
  }
}

// Run the test
testAIExtractor();