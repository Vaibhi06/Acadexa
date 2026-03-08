import sequelize from './config/database.js';

async function showTableStructure() {
    try {
        const [results] = await sequelize.query('DESCRIBE students');

        console.log('\n=== STUDENTS TABLE COLUMNS ===\n');
        results.forEach(col => {
            console.log(`${col.Field.padEnd(20)} | ${col.Type.padEnd(30)} | ${col.Null} | ${col.Key} | ${col.Default}`);
        });

        console.log('\n\n=== CHECKING FOR middleName column ===');
        const hasMiddleName = results.find(r => r.Field === 'middleName');
        if (hasMiddleName) {
            console.log('✅ middleName column EXISTS');
        } else {
            console.log('❌ middleName column MISSING!');
            console.log('\n🔧 This is the problem! Need to add middleName column to database.');
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

showTableStructure();
