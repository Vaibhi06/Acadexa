import sequelize from './config/database.js';
import Student from './models/Student.js';
import Class from './models/Class.js';

async function migrateData() {
    try {
        console.log('🔄 Starting data migration: Class Names -> Class Codes');

        // authenticate
        await sequelize.authenticate();
        console.log('✅ Database connected.');

        // 1. Get all classes
        const classes = await Class.findAll();
        console.log(`📚 Found ${classes.length} classes.`);

        const nameToCodeMap = {};
        classes.forEach(c => {
            nameToCodeMap[c.name] = c.code;
        });

        // 2. Get all students
        const students = await Student.findAll();
        console.log(`👨‍🎓 Found ${students.length} students.`);

        let updatedCount = 0;

        for (const student of students) {
            const currentVal = student.classCode; // This might be "10th Grade A"

            // Check if it's a name that needs mapping
            if (nameToCodeMap[currentVal]) {
                const newCode = nameToCodeMap[currentVal];
                console.log(`   Update Student ${student.firstName}: "${currentVal}" -> "${newCode}"`);

                await student.update({ classCode: newCode });
                updatedCount++;
            } else {
                // Check if it's already a valid code?
                const isCode = classes.some(c => c.code === currentVal);
                if (isCode) {
                    console.log(`   Student ${student.firstName}: "${currentVal}" is already a code. Skipping.`);
                } else {
                    console.log(`   ⚠️ Student ${student.firstName}: "${currentVal}" does not match any class Name or Code.`);
                }
            }
        }

        console.log(`✅ Data migration complete. Updated ${updatedCount} students.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrateData();
