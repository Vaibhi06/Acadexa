import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL Database Connected Successfully!');
        console.log(`📁 Database: ${process.env.DB_NAME}`);

        // Sync all models with database
        // NOTE: alter: true can cause silent crashes on some systems with complex constraints
        await sequelize.sync(); 
        console.log('✅ Database Synchronized');
    } catch (error) {
        console.error('❌ Unable to connect to database:', error.message);
        process.exit(1);
    }
};

export { sequelize, connectDB };
export default sequelize;
