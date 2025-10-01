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
        
        const text = await response.text();
        // Look for the error message in the response
        const errorMatch = text.match(/<span class="block sm:inline">([^<]+)<\/span>/);
        if (errorMatch && errorMatch[1]) {
            console.log('Error message:', errorMatch[1]);
        } else {
            console.log('No specific error message found in response');
        }
    } catch (error) {
        console.error('Error during registration test:', error);
    }
}

testRegistrationNewUser();