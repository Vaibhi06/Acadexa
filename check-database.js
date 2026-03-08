// Quick script to check if there's any data in the database
const checkDatabase = async () => {
    try {
        console.log('Checking database for data...\n');

        // Check students
        const studentsRes = await fetch('http://localhost:5000/api/students');
        const studentsData = await studentsRes.json();
        console.log('Students:', studentsData.success ? studentsData.data.length : 0);

        // Check classes
        const classesRes = await fetch('http://localhost:5000/api/classes');
        const classesData = await classesRes.json();
        console.log('Classes:', classesData.success ? classesData.data.length : 0);

        // Check faculty
        const facultyRes = await fetch('http://localhost:5000/api/faculty');
        const facultyData = await facultyRes.json();
        console.log('Faculty:', facultyData.success ? facultyData.data.length : 0);

        // Check inquiries
        const inquiriesRes = await fetch('http://localhost:5000/api/inquiries');
        const inquiriesData = await inquiriesRes.json();
        console.log('Inquiries:', inquiriesData.success ? inquiriesData.data.length : 0);

        console.log('\nDatabase check complete!');

        if (studentsData.data?.length === 0 && classesData.data?.length === 0) {
            console.log('\n⚠️  Your database is EMPTY!');
            console.log('This is why the dashboard shows all zeros.');
            console.log('You need to add students, classes, and faculty from their respective pages.');
        }
    } catch (error) {
        console.error('Error checking database:', error.message);
    }
};

checkDatabase();
