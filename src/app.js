import express from 'express';
import teamsRoutes from './routes/Teams.routes.js';
import playerRoutes from './routes/Players.routes.js';
import director from './routes/Director.routes.js';
import ConnectDB from './config/db.js';
import dotenv from 'dotenv';

const app = express();
ConnectDB.connect();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/directors', director);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
