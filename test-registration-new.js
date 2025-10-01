async function testRegistrationNewUser() {
    try {
        const response = await fetch('http://localhost:7000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                photon_id: 'PHOTON456',
                name: 'Test User 2',
                phone: '9876543210',
                class: '11th',
                course: 'NEET-UG',
                email: 'test2@example.com',
                password: 'testpassword2',
                confirmPassword: 'testpassword2'
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', [...response.headers.entries()]);
        
        const text = await response.text();
        console.log('Response body:', text.substring(0, 500) + '...'); // First 500 chars
    } catch (error) {
        console.error('Error during registration test:', error);
    }
}

testRegistrationNewUser();