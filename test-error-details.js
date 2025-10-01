async function testRegistrationErrorDetails() {
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
        // Look for the full error message in the response
        const errorMatch = text.match(/<div class="bg-red-100 border border-red-400 text-red-700[^>]*>[\s\S]*?<span class="block sm:inline">([^<]+)<\/span>[\s\S]*?<\/div>/);
        if (errorMatch && errorMatch[1]) {
            console.log('Full error message:', errorMatch[1]);
        } else {
            // Try a simpler match
            const simpleMatch = text.match(/<span class="block sm:inline">([^<]+)<\/span>/);
            if (simpleMatch && simpleMatch[1]) {
                console.log('Simple error message:', simpleMatch[1]);
            } else {
                console.log('No error message found in response');
                // Show first 1000 characters of response
                console.log('Response preview:', text.substring(0, 1000));
            }
        }
    } catch (error) {
        console.error('Error during registration test:', error);
    }
}

testRegistrationErrorDetails();