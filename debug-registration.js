const { registerUser } = require('./dist/database.js');

async function testRegistration() {
    try {
        console.log('Testing user registration directly...');
        
        const testUser = {
            photon_id: 'DEBUG001',
            name: 'Debug User',
            phone: '9876543210',
            class: '11th',
            course: 'NEET-UG',
            email: 'debug@example.com',
            password: 'debugpassword'
        };
        
        console.log('Attempting to register user:', testUser);
        
        const result = await registerUser(testUser);
        
        if (result) {
            console.log('Registration successful!');
            console.log('Result:', result);
        } else {
            console.log('Registration failed - no result returned');
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}

testRegistration();