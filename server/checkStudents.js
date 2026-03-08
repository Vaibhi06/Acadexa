import { connectDB, sequelize } from './config/database.js';

const checkStudents = async () => {
    try {
        await connectDB();

        // Query to show all tables
        const [tables] = await sequelize.query("SHOW TABLES");
        console.log('📊 Available tables in database:');
        console.log(tables);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Try to query students table if it exists
        try {
            const [students] = await sequelize.query("SELECT * FROM students");
            console.log('\n✅ Students in database:');
            console.log(JSON.stringify(students, null, 2));
            console.log(`\nTotal students: ${students.length}`);
        } catch (err) {
            console.log('\n⚠️  No "students" table found in database');
            console.log('Students are currently stored in browser localStorage, not MySQL');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkStudents();
