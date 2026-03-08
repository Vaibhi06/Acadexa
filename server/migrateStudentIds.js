import sequelize from './config/database.js';
import Student from './models/Student.js';

async function migrateIds() {
    try {
        console.log('🔄 Starting Student ID migration to 6-digit format...');

        await sequelize.authenticate();
        console.log('✅ Database connected.');

        // Get all students
        const students = await Student.findAll();
        console.log(`👨‍🎓 Found ${students.length} students to migrate.`);

        // Keep track of generated IDs to ensure uniqueness during this run
        const usedIds = new Set();

        // Also pre-populate usedIds with any existing 6-digit IDs in DB (if any)
        // In case we run this partially or some future IDs exist
        const existingIds = students.map(s => s.id).filter(id => /^\d{6}$/.test(id));
        existingIds.forEach(id => usedIds.add(id));

        const generateId = () => {
            let id;
            do {
                id = Math.floor(100000 + Math.random() * 900000).toString();
            } while (usedIds.has(id));
            usedIds.add(id);
            return id;
        };

        let updatedCount = 0;

        for (const student of students) {
            const oldId = student.id;

            // Skip if already 6 digits (and numeric)
            if (/^\d{6}$/.test(oldId)) {
                console.log(`   Skipping ${student.firstName} (ID: ${oldId}) - Already 6 digits.`);
                continue;
            }

            const newId = generateId();

            console.log(`   Migrating ${student.firstName}: ${oldId} -> ${newId}`);

            // Use direct SQL update to avoid Sequelize PK update restrictions
            // We update the ID where ID matches old ID
            await sequelize.query(
                'UPDATE students SET id = :newId WHERE id = :oldId',
                {
                    replacements: { newId, oldId },
                    type: sequelize.QueryTypes.UPDATE
                }
            );

            updatedCount++;
        }

        console.log(`✅ Migration complete. Updated ${updatedCount} students.`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrateIds();
