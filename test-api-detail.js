// Detailed API test
const testAPI = async () => {
    try {
        console.log('Testing API with full error handling...\n');

        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        const text = await response.text();

        console.log('Status Code:', response.status);
        console.log('Response Headers:', JSON.stringify([...response.headers.entries()], null, 2));
        console.log('\nRaw Response:');
        console.log(text);

        try {
            const data = JSON.parse(text);
            console.log('\nParsed JSON:');
            console.log(JSON.stringify(data, null, 2));
        } catch (e) {
            console.log('\n❌ Could not parse as JSON');
        }

    } catch (error) {
        console.error('❌ Fetch Error:', error.message);
    }
};

testAPI();
