const { Pool } = require('pg');
const dotenv = require('dotenv');
const winston = require('winston');

dotenv.config();

const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

const pool = new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'soccerdb',
    password: process.env.DB_PASSWORD || 'admin123',
    port: process.env.DB_PORT || 5432,
});

const connectDB = async () => {
    try {
        logger.info('Connecting to the database...');
        await pool.query('SELECT 1');
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed', error);
        throw error;
    }
};

module.exports = {
    connect: connectDB,
    query: (...params) => pool.query(...params),
    end: () => pool.end()
};
