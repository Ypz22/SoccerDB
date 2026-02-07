const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConnectDB = require('../config/db');
const logger = require('../utils/logger');

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await ConnectDB.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Usuario creado correctamente',
            user: result.rows[0]
        });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;


    try {
        const result = await ConnectDB.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);


        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            'KJHf83kjsd9F!@#23kslD9fjs8FJsl39@!',
            { expiresIn: '1h' }
        );


        res.json({ token });
    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = { register, login };
