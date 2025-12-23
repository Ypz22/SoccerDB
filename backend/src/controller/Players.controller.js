const ConnectDB = require('../config/db.js');
const logger = require('../utils/logger.js');

/* GET todos los jugadores del usuario */
const getAllPlayers = async (req, res) => {
    try {
        const result = await ConnectDB.query(
            'SELECT * FROM jugadores WHERE user_id = $1',
            [req.user.id]
        );
        res.status(200).json(result.rows);
        logger.info('Players fetched by user');
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

/* GET jugador por ID (solo si pertenece al usuario) */
const getPlayerById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM jugadores WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found o no autorizado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching player' });
    }
};

/* CREATE jugador asociado al usuario */
const createPlayer = async (req, res) => {
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;

    if (!nombre || !apellido || edad === undefined || altura === undefined || !pierna_buena || !club) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        const result = await ConnectDB.query(
            `INSERT INTO jugadores
      (nombre, apellido, edad, altura, pierna_buena, club, user_id)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club, req.user.id]
        );

        res.status(201).json(result.rows[0]);
        logger.info('Player created for user');
    } catch (error) {
        res.status(500).json({ error: 'Failed to add player' });
    }
};

/* UPDATE solo si pertenece al usuario */
const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            `UPDATE jugadores
       SET nombre=$1, apellido=$2, edad=$3, altura=$4, pierna_buena=$5, club=$6
       WHERE id=$7 AND user_id=$8
       RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found o no autorizado' });
        }

        res.json(result.rows[0]);
        logger.info('Player updated by user');
    } catch (error) {
        res.status(500).json({ error: 'Failed to update player' });
    }
};

/* DELETE solo si pertenece al usuario */
const deletePlayer = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'El parámetro "id" debe ser numérico' });
    }

    try {
        const result = await ConnectDB.query(
            'DELETE FROM jugadores WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found o no autorizado' });
        }

        res.json({ message: 'Player deleted successfully' });
        logger.info('Player deleted by user');
    } catch (error) {
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
