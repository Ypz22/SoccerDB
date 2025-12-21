const logger = require('../utils/logger.js');
const ConnectDB = require('../config/db.js');

const getAllDirector = async (req, res) => {
    try {
        const result = await ConnectDB.query('SELECT * FROM technicalDirector');
        res.status(200).json(result.rows);
        logger.info('Technical Directors fetched successfully');
    } catch (error) {
        logger.error('Failed to fetch directors:', error);
        res.status(500).json({ error: 'Failed to fetch directors' });
    }
};


const getDirectorById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM technicalDirector WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Director no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener director:', error);
        res.status(500).json({ error: 'Error al obtener director' });
    }
};


const createDirector = async (req, res) => {
    const { name, nationality, age, currentTeam, yearsExperience, email, cellphone } = req.body;

    if (!name || !nationality || !age || !currentTeam || !yearsExperience || !email || !cellphone) {
        return res.status(500).json({ error: 'Datos incompletos' });
    }

    try {
        const result = await ConnectDB.query(
            'INSERT INTO technicalDirector (name, nationality, age, currentTeam, yearsExperience, email, cellphone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, nationality, age, currentTeam, yearsExperience, email, cellphone]
        );
        res.status(201).json(result.rows[0]);
        logger.info('Technical Director added successfully');
    } catch (error) {
        logger.error('Failed to add Technical Director:', error);
        res.status(500).json({ error: 'Failed to add Technical Director' });
    }
};




const updateDirector = async (req, res) => {
    const { id } = req.params;
    const { name, nationality, age, currentTeam, yearsExperience, email, cellphone } = req.body;
    try {
        const result = await ConnectDB.query(
            'UPDATE technicalDirector SET name = $1, nationality = $2, age = $3, currentTeam = $4, yearsExperience = $5, email = $6, cellphone = $7 WHERE id = $8 RETURNING *',
            [name, nationality, age, currentTeam, yearsExperience, email, cellphone, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Technical Director not found' });
        }
        res.status(200).json(result.rows[0]);
        logger.info('Technical Director updated successfully');
    } catch (error) {
        logger.error('Failed to update Technical Director:', error);
        res.status(500).json({ error: 'Failed to update Technical Director' });
    }
};

const deleteDirector = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await ConnectDB.query(
            'DELETE FROM technicalDirector WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Technical Director not found' });
        }
        res.status(200).json({ message: 'Technical Director deleted successfully' });
        logger.info('Technical Director deleted successfully');
    } catch (error) {
        logger.error('Failed to delete Technical Director:', error);
        res.status(500).json({ error: 'Failed to delete Technical Director' });
    }
};

module.exports = {
    getAllDirector,
    createDirector,
    getDirectorById,
    updateDirector,
    deleteDirector
};
