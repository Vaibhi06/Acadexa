import Syllabus from './models/Syllabus.js';
import { connectDB } from './config/database.js';

const testSyllabusConnection = async () => {
    try {
        console.log('🔍 Testing Syllabus Database Connection...\n');

        // Connect to database
        await connectDB();
        console.log('✅ Database connected\n');

        // Get all syllabus records
        const syllabusRecords = await Syllabus.findAll();

        console.log(`📚 Found ${syllabusRecords.length} syllabus record(s) in database\n`);

        if (syllabusRecords.length > 0) {
            console.log('📋 Current Syllabus Records:');
            console.log('━'.repeat(60));
            syllabusRecords.forEach((record, index) => {
                console.log(`\n${index + 1}. Class: ${record.class}`);
                console.log(`   Subject: ${record.subject}`);
                console.log(`   Faculty: ${record.faculty || 'Not assigned'}`);

                // Parse chapters if it's a string
                const chapters = typeof record.chapters === 'string'
                    ? JSON.parse(record.chapters)
                    : record.chapters;

                console.log(`   Chapters: ${chapters?.length || 0}`);
                if (chapters && Array.isArray(chapters) && chapters.length > 0) {
                    chapters.forEach((ch, i) => {
                        console.log(`     ${i + 1}. ${ch.title} (${ch.topics?.length || 0} topics)`);
                    });
                }
            });
            console.log('\n' + '━'.repeat(60));
        } else {
            console.log('\n⚠️  No syllabus records found.');
            console.log('💡 Go to Syllabus Management and create your first syllabus!\n');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testSyllabusConnection();
