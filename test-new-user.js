const http = require('http');
const querystring = require('querystring');

// First, let's register a new user
const registerData = querystring.stringify({
    photon_id: 'PHOTON001',
    name: 'Test User',
    phone: '1234567890',
    class: '12th',
    course: 'JEE Main + Advanced',
    email: 'test@example.com',
    password: 'testpassword',
    confirmPassword: 'testpassword'
});

const registerOptions = {
    hostname: 'localhost',
    port: 7000,
    path: '/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(registerData)
    }
};

const registerReq = http.request(registerOptions, (res) => {
    console.log(`Registration Status Code: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Registration completed');
        
        // Now let's try to login
        const loginData = querystring.stringify({
            photon_id: 'PHOTON001',
            password: 'testpassword'
        });

        const loginOptions = {
            hostname: 'localhost',
            port: 7000,
            path: '/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(loginData)
            }
        };

        const loginReq = http.request(loginOptions, (res) => {
            console.log(`Login Status Code: ${res.statusCode}`);
            
            let loginData = '';
            res.on('data', (chunk) => {
                loginData += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 302) {
                    console.log('Login successful! Redirected to student corner.');
                } else if (loginData.includes('Invalid Photon ID or Password')) {
                    console.log('Login failed: Invalid Photon ID or Password');
                } else {
                    console.log('Login response received');
                }
            });
        });

        loginReq.on('error', (error) => {
            console.error(`Login error: ${error.message}`);
        });

        loginReq.write(loginData);
        loginReq.end();
    });
});

registerReq.on('error', (error) => {
    console.error(`Registration error: ${error.message}`);
});

registerReq.write(registerData);
registerReq.end();