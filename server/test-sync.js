console.log('--- Sync Test Start ---');
let count = 0;
const start = Date.now();
while (Date.now() - start < 5000) {
    // busy wait
    count++;
    if (count % 1000000 === 0) console.log(`Busy... ${count / 1000000}M`);
}
console.log('--- Sync Test Finished ---');
