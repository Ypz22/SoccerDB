import ConnectDB from '../config/db.js';

export const getAllDirector = async (req, res) => {
    try {
        const result = await ConnectDB.query('SELECT * FROM technicalDirector');
        res.status(200).json(result.rows);
        console.log('Technical Directos fetched successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch directos' });
    }
}

export const createDirector = async (req, res) => {
    const { name, nationality, age, currentTeam,yearsExperience,email, cellphone } = req.body;
    try {
        const result = await ConnectDB.query(
            'INSERT INTO technicalDirector (name, nationality, age, currentTeam, yearsExperience, email, cellphone) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, nationality, age, currentTeam,yearsExperience,email, cellphone ]
        );
        res.status(201).json(result.rows[0]);
        console.log('Technical Director added successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to add Technical Director' });
    }
}


export const updateDirector = async (req, res) => {
    const { id } = req.params;
    const { name, nationality, age, currentTeam,yearsExperience,email, cellphone } = req.body;
    try {
        const result = await ConnectDB.query(
            'UPDATE technicalDirector SET name = $1, nationality = $2, age = $3, currentTeam = $4 , yearsExperience = $5, email =$6 , cellphone = $7   WHERE id = $8 RETURNING *',
            [name, nationality, age, currentTeam,yearsExperience,email, cellphone, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Technical Director not found' });
        }
        res.status(200).json(result.rows[0]);
        console.log('Technical Director updated successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to update Technical Director' });
    }
}



export const deleteDirector = async (req, res) => {
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
        console.log('Technical Director deleted successfully');
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete Technical Director' });
    }
}