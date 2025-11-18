const ConnectDB = require('../config/db.js');
const logger = require('../utils/logger.js');

const getAllTeams = async (req, res) => {
    try {
        const result = await ConnectDB.query('SELECT * FROM teams');
        res.status(200).json(result.rows);
        logger.info('Teams fetched successfully');
    } catch (error) {
        logger.error('Failed to fetch teams:', error);
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
};

const getTeamById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM teams WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error fetching team:', error);
        res.status(500).json({ error: 'Error fetching team' });
    }
};

const createTeam = async (req, res) => {
    const { name, city, stadium, year_foundation } = req.body;
    if (!name || !city || !stadium || !year_foundation) {
        return res.status(400).json({ error: 'Failed to add team' });
    }
    try {
        const result = await ConnectDB.query(
            'INSERT INTO teams (name, city, stadium, year_foundation) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, city, stadium, year_foundation]
        );
        res.status(201).json(result.rows[0]);
        logger.info('Team added successfully');
    } catch (error) {
        logger.error('Failed to add team:', error);
        res.status(500).json({ error: 'Failed to add team' });
    }
};

const updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name, city, stadium, year_foundation } = req.body;
    try {
        const result = await ConnectDB.query(
            'UPDATE teams SET name = $1, city = $2, stadium = $3, year_foundation = $4 WHERE id = $5 RETURNING *',
            [name, city, stadium, year_foundation, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.status(200).json(result.rows[0]);
        logger.info('Team updated successfully');
    } catch (error) {
        logger.error('Failed to update team:', error);
        res.status(500).json({ error: 'Failed to update team' });
    }
};

const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ConnectDB.query(
            'DELETE FROM teams WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.status(200).json({ message: 'Team deleted successfully' });
        logger.info('Team deleted successfully');
    } catch (error) {
        logger.error('Failed to delete team:', error);
        res.status(500).json({ error: 'Failed to delete team' });
    }
};

module.exports = {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
};
