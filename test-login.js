async function testLogin() {
    try {
        const response = await fetch('http://localhost:7000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                photon_id: 'PHOTON456',
                password: 'testpassword2'
            }),
            redirect: 'manual' // Don't follow redirects so we can see the response
        });

        console.log('Login Response status:', response.status);
        console.log('Login Response headers:', [...response.headers.entries()]);
        
        // Check if it's a redirect
        if (response.status === 302) {
            console.log('Login successful! Redirecting to:', response.headers.get('location'));
            
            // Check for set-cookie header which indicates successful login
            const cookies = response.headers.get('set-cookie');
            if (cookies) {
                console.log('Cookie set:', cookies);
            }
        } else {
            // If not redirecting, get the response body to see the error
            const text = await response.text();
            console.log('Login failed. Response body:', text.substring(0, 1000));
        }
    } catch (error) {
        console.error('Error during login test:', error);
    }
}

testLogin();