const express = require('express');
const teamsRoutes = require('./routes/Teams.routes');
const playerRoutes = require('./routes/Players.routes');
const directorRoutes = require('./routes/Director.routes');
const ConnectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();
ConnectDB.connect();

const app = express();

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.json());



app.use(express.static('src/public'));

app.use('/api/teams', teamsRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/directors', directorRoutes);

module.exports = app;
