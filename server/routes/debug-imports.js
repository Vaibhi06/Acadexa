import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

console.log('--- Testing Individual Route Imports ---');

const routes = [
    './authRoutes.js',
    './classRoutes.js',
    './studentRoutes.js',
    './attendanceRoutes.js',
    './inquiryRoutes.js',
    './taskRoutes.js',
    './facultyRoutes.js',
    './feeRoutes.js',
    './examRoutes.js',
    './markRoutes.js',
    './syllabusRoutes.js',
    './timetableRoutes.js',
    './studyMaterialRoutes.js',
    './noticeRoutes.js',
    './incomeRoutes.js',
    './expenseRoutes.js',
    './dashboardRoutes.js'
];

for (const route of routes) {
    try {
        console.log(`Importing ${route}...`);
        await import(route);
        console.log(`✅ ${route} imported successfully`);
    } catch (error) {
        console.error(`❌ Error importing ${route}:`, error.message);
    }
}

console.log('--- All imports tested ---');
process.exit(0);
