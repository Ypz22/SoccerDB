const logger = require('../utils/logger.js');
const ConnectDB = require('../config/db.js');

/* GET todos los directores del usuario autenticado */
const getAllDirector = async (req, res) => {
    try {
        const result = await ConnectDB.query(
            'SELECT * FROM technicalDirector WHERE user_id = $1',
            [req.user.id]
        );
        res.status(200).json(result.rows);
        logger.info('Directors fetched by user');
    } catch (error) {
        logger.error('Failed to fetch directors:', error);
        res.status(500).json({ error: 'Failed to fetch directors' });
    }
};

/* GET director por ID (solo si pertenece al usuario) */
const getDirectorById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM technicalDirector WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Director no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Failed to fetch directors:', error);
        res.status(500).json({ error: 'Error al obtener director' });
    }
};

/* CREATE director asociado al usuario */
const createDirector = async (req, res) => {
    const {
        name,
        nationality,
        age,
        currentTeam,
        yearsExperience,
        email,
        cellphone
    } = req.body;

    if (
        !name || !nationality || !age ||
        !currentTeam || !yearsExperience ||
        !email || !cellphone
    ) {
        logger.error('Failed to fetch directors:');
        return res.status(500).json({ error: 'Failed to add Technical Director' });
    }

    try {
        const result = await ConnectDB.query(
            `INSERT INTO technicalDirector
            (name, nationality, age, currentTeam, yearsExperience, email, cellphone, user_id)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [
                name,
                nationality,
                age,
                currentTeam,
                yearsExperience,
                email,
                cellphone,
                req.user.id
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Failed to fetch directors:', error);
        res.status(500).json({ error: 'Failed to add Technical Director' });
    }
};

/* UPDATE solo si es del usuario */
const updateDirector = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        nationality,
        age,
        currentTeam,
        yearsExperience,
        email,
        cellphone
    } = req.body;

    if (
        !name || !nationality || !age ||
        !currentTeam || !yearsExperience ||
        !email || !cellphone
    ) {
        return res.status(400).json({ error: 'No se permiten campos vacíos' });
    }

    try {
        const result = await ConnectDB.query(
            `UPDATE technicalDirector
            SET name=$1, nationality=$2, age=$3,
                currentTeam=$4, yearsExperience=$5,
                email=$6, cellphone=$7
            WHERE id=$8 AND user_id=$9
            RETURNING *`,
            [
                name,
                nationality,
                age,
                currentTeam,
                yearsExperience,
                email,
                cellphone,
                id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No autorizado o no existe' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Failed to fetch directors:', error);
        res.status(500).json({ error: 'Failed to update Technical Director' });
    }
};

/* DELETE solo si es del usuario */
const deleteDirector = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            'DELETE FROM technicalDirector WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No autorizado o no existe' });
        }

        res.status(200).json({ message: 'Director eliminado' });
    } catch (error) {
        logger.error('Failed to fetch directors:', error);
        res.status(500).json({ error: 'Failed to delete Technical Director' });
    }
};

module.exports = {
    getAllDirector,
    getDirectorById,
    createDirector,
    updateDirector,
    deleteDirector
};
