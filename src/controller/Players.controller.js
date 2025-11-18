const ConnectDB = require('../config/db.js');
const logger = require('../utils/logger.js');


//Obtener todos los jugadores
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

//Obtener jugador por ID
const getPlayerById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            'SELECT * FROM jugadores WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        logger.error('Error al obtener jugador:', error);
        res.status(500).json({ error: 'Error al obtener jugador' });
    }
};

//Crear jugador
const createPlayer = async (req, res) => {
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;

    //Validacion
    if (!nombre || !apellido || !edad || !altura || !pierna_buena || !club) {
        return res.status(500).json({ error: 'Datos incompletos' });
    }

    try {
        const result = await ConnectDB.query(
            `INSERT INTO jugadores (nombre, apellido, edad, altura, pierna_buena, club)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club]
        );

        res.status(201).json(result.rows[0]);
        logger.info('Player added successfully');
    } catch (error) {
        logger.error('Failed to add player:', error);
        res.status(500).json({ error: 'Failed to add player' });
    }
};

//Actualizar jugador
const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;

    try {
        const result = await ConnectDB.query(
            `UPDATE jugadores
             SET nombre = $1, apellido = $2, edad = $3, altura = $4, pierna_buena = $5, club = $6
             WHERE id = $7 RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.status(200).json(result.rows[0]);
        logger.info('Player updated successfully');
    } catch (error) {
        logger.error('No se pudo actualizar los datos del jugador:', error);
        res.status(500).json({ error: 'No se pudo actualizar los datos del jugador' });
    }
};

//Eliminar jugador
const deletePlayer = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            'DELETE FROM jugadores WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.status(200).json({ message: 'Jugador eliminado correctamente' });
        logger.info('Jugador eliminado correctamente');
    } catch (error) {
        logger.error('Error al eliminar el jugador:', error);
        res.status(500).json({ error: 'Error al eliminar el jugador' });
    }
};

module.exports = {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer
};
