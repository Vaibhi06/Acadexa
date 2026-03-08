// Direct MySQL query to check what's in the database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'portal_db'
        });

        console.log('✅ Connected to MySQL database\n');
        console.log('Database:', process.env.DB_NAME || 'portal_db');
        console.log('='.repeat(50));

        // Check all tables
        const tables = ['students', 'classes', 'faculty', 'inquiries', 'users', 'attendances'];

        for (const table of tables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                const [allData] = await connection.execute(`SELECT * FROM ${table} LIMIT 3`);

                console.log(`\n📊 ${table.toUpperCase()}: ${rows[0].count} records`);

                if (allData.length > 0) {
                    console.log('   First record:', JSON.stringify(allData[0], null, 2).substring(0, 200) + '...');
                } else {
                    console.log('   ⚠️  EMPTY TABLE');
                }
            } catch (error) {
                console.log(`\n❌ ${table.toUpperCase()}: ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(50));

        await connection.end();

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Make sure MySQL is running in XAMPP');
    }
}

checkDatabase();
