const ConnectDB = require('../config/db.js');
const logger = require('../utils/logger.js');

const getAllPlayers = async (req, res) => {
    try {
        const result = await ConnectDB.query('SELECT * FROM jugadores');
        res.status(200).json(result.rows);
        logger.info('Players fetched successfully');
    } catch (error) {
        logger.error('Failed to fetch players:', error);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

const getPlayerById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM jugadores WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error fetching player:', error);
        res.status(500).json({ error: 'Error fetching player' });
    }
};

const createPlayer = async (req, res) => {
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
    }
    if (!apellido) {
        return res.status(400).json({ error: 'El campo "apellido" es obligatorio' });
    }
    if (edad === undefined) {
        return res.status(400).json({ error: 'El campo "edad" es obligatorio' });
    }
    if (altura === undefined) {
        return res.status(400).json({ error: 'El campo "altura" es obligatorio' });
    }
    if (!pierna_buena) {
        return res.status(400).json({ error: 'El campo "pierna_buena" es obligatorio' });
    }
    if (!club) {
        return res.status(400).json({ error: 'El campo "club" es obligatorio' });
    }

    try {
        const result = await ConnectDB.query(
            `INSERT INTO jugadores
            (nombre, apellido, edad, altura, pierna_buena, club)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club]
        );

        res.status(201).json(result.rows[0]);
        logger.info('Player added successfully');
    } catch (error) {
        logger.error('Failed to add player:', error);
        res.status(500).json({ error: 'Failed to add player' });
    }
};

const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    if (!nombre) {
        return res.status(400).json({ error: 'El campo "nombre" es obligatorio' });
    }
    if (!apellido) {
        return res.status(400).json({ error: 'El campo "apellido" es obligatorio' });
    }
    if (edad === undefined) {
        return res.status(400).json({ error: 'El campo "edad" es obligatorio' });
    }
    if (altura === undefined) {
        return res.status(400).json({ error: 'El campo "altura" es obligatorio' });
    }
    if (!pierna_buena) {
        return res.status(400).json({ error: 'El campo "pierna_buena" es obligatorio' });
    }
    if (!club) {
        return res.status(400).json({ error: 'El campo "club" es obligatorio' });
    }

    try {
        const result = await ConnectDB.query(
            `UPDATE jugadores
             SET nombre=$1, apellido=$2, edad=$3, altura=$4, pierna_buena=$5, club=$6
             WHERE id=$7 RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json(result.rows[0]);
        logger.info('Player updated successfully');
    } catch (error) {
        logger.error('Failed to update player:', error);
        res.status(500).json({ error: 'Failed to update player' });
    }
};

const deletePlayer = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            'DELETE FROM jugadores WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json({ message: 'Player deleted successfully' });
        logger.info('Player deleted successfully');
    } catch (error) {
        logger.error('Failed to delete player:', error);
        res.status(500).json({ error: 'Failed to delete player' });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
};
