async function testInvalidLogin() {
    try {
        const response = await fetch('http://localhost:7000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                photon_id: 'INVALID_ID',
                password: 'wrong_password'
            })
        });

        console.log('Invalid Login Response status:', response.status);
        
        const text = await response.text();
        // Look for the error message in the response
        const errorMatch = text.match(/<div class="bg-red-100 border border-red-400 text-red-700[^>]*>[\s\S]*?<span class="block sm:inline">([^<]+)<\/span>[\s\S]*?<\/div>/);
        if (errorMatch && errorMatch[1]) {
            console.log('Error message:', errorMatch[1]);
        } else {
            // Try a simpler match
            const simpleMatch = text.match(/<span class="block sm:inline">([^<]+)<\/span>/);
            if (simpleMatch && simpleMatch[1]) {
                console.log('Simple error message:', simpleMatch[1]);
            } else {
                console.log('No error message found in response');
            }
        }
    } catch (error) {
        console.error('Error during invalid login test:', error);
    }
}

testInvalidLogin();