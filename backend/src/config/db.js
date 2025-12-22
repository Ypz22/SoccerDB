const pg = require('pg');
const dotenv = require('dotenv');
const winston = require('winston');
const logger = winston.createLogger({
    transports: [new winston.transports.Console()]
});

dotenv.config();

const ConnectDB = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'soccerdb',
    password: '150404',
    port: 5432, 
});

const connectDB = async () => {
    try {
        logger.info('Connecting to the database...');
        await ConnectDB.connect();
        logger.info('Database connected successfully');
    } catch (error) {
        logger.error('Database connection failed:', error);
        throw error;
    }
};

module.exports = {
    connect: connectDB,
    query: (...params) => ConnectDB.query(...params),
};
