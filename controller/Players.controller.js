import ConnectDB from '../config/db.js';

// ✅ Get all players
export const getAllPlayers = async (req, res) => {
    try {
        const result = await ConnectDB.query('SELECT * FROM jugadores');
        res.status(200).json(result.rows);
        console.log('Players fetched successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch players' });
    }
};

// ✅ Create player
export const createPlayer = async (req, res) => {
    const { nombre, apellido, edad, altura, pierna_buena, club } = req.body;
    try {
        const result = await ConnectDB.query(
            `INSERT INTO jugadores (nombre, apellido, edad, altura, pierna_buena, club)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, apellido, edad, altura, pierna_buena, club]
        );

        res.status(201).json(result.rows[0]);
        console.log('Player added successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to add player' });
    }
};

// ✅ Update player
export const updatePlayer = async (req, res) => {
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
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json(result.rows[0]);
        console.log('Player updated successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to update player' });
    }
};

// ✅ Delete player
export const deletePlayer = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await ConnectDB.query(
            `DELETE FROM jugadores WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.status(200).json({ message: 'Player deleted successfully' });
        console.log('Player deleted successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete player' });
    }
};
