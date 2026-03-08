console.log('--- Non-Network Test Start ---');
let count = 0;
const id = setInterval(() => {
    count++;
    console.log(`Still alive... (${count})`);
    if (count >= 10) {
        clearInterval(id);
        console.log('--- Test Finished Successfully ---');
    }
}, 1000);
