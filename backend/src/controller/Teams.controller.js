const ConnectDB = require('../config/db.js');
const logger = require('../utils/logger.js');

/* GET todos los equipos del usuario */
const getAllTeams = async (req, res) => {
    try {
        const result = await ConnectDB.query(
            'SELECT * FROM teams WHERE user_id = $1',
            [req.user.id]
        );
        res.status(200).json(result.rows);
        logger.info('Teams fetched by user');
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
};

/* GET equipo por ID (solo del usuario) */
const getTeamById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM teams WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found o no autorizado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error fetching team' });
    }
};

/* CREATE equipo asociado al usuario */
const createTeam = async (req, res) => {
    const { name, city, stadium, year_foundation } = req.body;

    if (!name || !city || !stadium || year_foundation === undefined) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const result = await ConnectDB.query(
            `INSERT INTO teams (name, city, stadium, year_foundation, user_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
            [name, city, stadium, year_foundation, req.user.id]
        );

        res.status(201).json(result.rows[0]);
        logger.info('Team created for user');
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error creating team' });
    }
};

/* UPDATE solo si pertenece al usuario */
const updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name, city, stadium, year_foundation } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            `UPDATE teams
       SET name=$1, city=$2, stadium=$3, year_foundation=$4
       WHERE id=$5 AND user_id=$6
       RETURNING *`,
            [name, city, stadium, year_foundation, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found o no autorizado' });
        }

        res.json(result.rows[0]);
        logger.info('Team updated by user');
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error updating team' });
    }
};

/* DELETE solo si pertenece al usuario */
const deleteTeam = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            'DELETE FROM teams WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found o no autorizado' });
        }

        res.json({ message: 'Team deleted successfully' });
        logger.info('Team deleted by user');
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Error deleting team' });
    }
};

module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
};
