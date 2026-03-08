import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? '(set)' : '(empty)',
  name: process.env.DB_NAME,
  port: process.env.DB_PORT
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log('✅ Connected to MySQL successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ FULL ERROR:', error.message);
  console.error('Error code:', error.original?.code);
  console.error('Error errno:', error.original?.errno);
  process.exit(1);
}
