
import sequelize from './config/database.js';
import Student from './models/Student.js';
import Class from './models/Class.js';

async function debugData() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        const students = await Student.findAll();
        const classes = await Class.findAll();

        console.log(`👨‍🎓 Total Students: ${students.length}`);
        console.log(`🏫 Total Classes: ${classes.length}`);

        if (classes.length > 0) {
            console.log('\n--- Classes Sample ---');
            classes.forEach(c => console.log(`Class: "${c.name}", Code: "${c.code}"`));
        }

        if (students.length > 0) {
            console.log('\n--- Students Sample (First 5) ---');
            students.slice(0, 5).forEach(s => {
                console.log(`Student: ${s.firstName}, ClassCode: "${s.classCode}"`);
            });
        }

        // Check for matches
        console.log('\n--- Checking Matches ---');
        classes.forEach(c => {
            const count = students.filter(s => s.classCode === c.code).length;
            console.log(`Class Code "${c.code}" has ${count} students.`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

debugData();
