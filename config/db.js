import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
})

export const connectDB = async () => {
    try {
        console.log('Connecting to the database...');
        await ConnectDB.connect();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

export default ConnectDB;