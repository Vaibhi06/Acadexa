// Final API test
const test = async () => {
    const response = await fetch('http://localhost:5000/api/dashboard/stats');
    const data = await response.json();

    console.log('\n✅ API IS WORKING!\n');
    console.log('Dashboard Stats:');
    console.log(JSON.stringify(data.data.stats, null, 2));
};

test();
