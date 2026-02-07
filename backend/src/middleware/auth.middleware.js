const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'KJHf83kjsd9F!@#23kslD9fjs8FJsl39@!');
        req.user = decoded;
        next();
    } catch (error) {
        logger.error(error);
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
