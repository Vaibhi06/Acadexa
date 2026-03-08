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
        console.log('='.repeat(50));

        // Check all tables
        const tables = ['students', 'classes', 'faculty', 'inquiries', 'users', 'attendances'];

        for (const table of tables) {
            try {
                const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
                const [allData] = await connection.execute(`SELECT * FROM ${table} LIMIT 5`);

                console.log(`\n📊 Table: ${table.toUpperCase()}`);
                console.log(`   Count: ${rows[0].count} records`);

                if (allData.length > 0) {
                    console.log(`   Sample data:`, JSON.stringify(allData[0], null, 2));
                } else {
                    console.log(`   ⚠️  No data found`);
                }
            } catch (error) {
                console.log(`\n❌ Table: ${table.toUpperCase()}`);
                console.log(`   Error: ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(50));

        await connection.end();

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Check your .env file and ensure MySQL is running in XAMPP');
    }
}

checkDatabase();
