import sequelize from './config/database.js';

async function migrateClassToClassCode() {
    try {
        console.log('🔄 Migrating database schema: Renaming "class" to "classCode"...');

        // Use raw query to rename the column
        // MySQL Syntax: ALTER TABLE students CHANGE class classCode VARCHAR(255);
        // We need to know if class is NULL or NOT NULL originally. In model it was allowNull: false.

        // Check if column 'class' exists first
        const [columns] = await sequelize.query('SHOW COLUMNS FROM students LIKE "class"');

        if (columns.length > 0) {
            console.log('Found column "class". Renaming to "classCode"...');
            await sequelize.query('ALTER TABLE students CHANGE class classCode VARCHAR(255) NOT NULL');
            console.log('✅ Column renamed successfully!');
        } else {
            console.log('Column "class" not found. Checking if "classCode" exists...');
            const [newCol] = await sequelize.query('SHOW COLUMNS FROM students LIKE "classCode"');
            if (newCol.length > 0) {
                console.log('✅ Column "classCode" already exists.');
            } else {
                console.log('❌ Neither "class" nor "classCode" found! Use syncDatabase.js to create it.');
            }
        }

    } catch (error) {
        console.error('❌ Error during migration:', error.message);
        if (error.original) {
            console.error('SQL Error:', error.original.sqlMessage);
        }
    } finally {
        await sequelize.close();
    }
}

migrateClassToClassCode();
