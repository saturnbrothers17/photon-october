// node-fetch is built into Node.js 18+

async function testRegistration() {
    try {
        const response = await fetch('http://localhost:7000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                photon_id: 'PHOTON123',
                name: 'Test User',
                phone: '1234567890',
                class: '12th',
                course: 'JEE Main + Advanced',
                email: 'test@example.com',
                password: 'testpassword',
                confirmPassword: 'testpassword'
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        const text = await response.text();
        console.log('Response body:', text);
    } catch (error) {
        console.error('Error during registration test:', error);
    }
}

testRegistration();