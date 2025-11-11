const express = require('express');
const teamsRoutes = require('./routes/Teams.routes.js');
const playerRoutes = require('./routes/Players.routes.js');
const director = require('./routes/Director.routes.js');
const ConnectDB = require('./config/db.js');
const dotenv = require('dotenv');

dotenv.config();

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
