const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db'); 


describe('Players API Endpoints - BD Real', () => {

    afterAll(async () => {
        await db.end(); 
    });
    //Prueba para obtener todos los jugadores
    test('GET /api/players - me deberia devolver jugadores reales', async () => {

        const response = await request(app).get('/api/players');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        const jugador = response.body.find(j => j.nombre === 'Damián');
        expect(jugador).toBeDefined();
    });
    //Prueba para obtener un jugador por ID
    test('GET /api/players/:id - me deberia devolver un jugador especifico por su id', async () => {
        const response = await request(app).get('/api/players/1');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('nombre');
    });
    //Prueba para crear un nuevo jugador
    test('POST /api/players - me deberia crear un jugador nuevo', async () => {
        const nuevoJugador = {
            nombre: 'Arturo',
            apellido: 'Mina',
            edad: 30,
        };

        const response = (await request(app).post('/api/players')).send(nuevoJugador);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.nombre).toBe('Arturo Mina');
    });
    //prueba para verificar error por falta de datos
    test('POST /api/players - me debe dar error por datos faltantes', async () => {
        const jugadorInvalido = {
            posicion: 'Delantero'
        };
        const response = await request(app).post('/api/players').send(jugadorInvalido);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
    //Prueba para actualizar un jugador existente
    test('PUT /api/players/:id - deberia actualizar un jugador', async () => {
        const jugadorActualizado = {
            nombre: 'Juan',
            edad: 28,
        };

        const response = await request(app).put('/api/players/1').send(jugadorActualizado);

        expect(response.statusCode).toBe(200);
        expect(response.body.nombre).toBe('Juan');
    });
    //prueba para actualizar un jugador que no existe
    test('PUT /api/players/:id - debe devolverme 404 si no existe el jugador', async () => {
        const response = await request(app).put('/api/players/2002').send({nombre: 'Prueba'});

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
    });
    //Eliminar un jugador
    test('DELETE /api/players/:id - deberia borrar un jugador', async () => {
        const response = await request(app).delete('/api/players/2');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('mensaje');
    });
    //error al eliminar un jugador que no existe
    test('DELETE /api/players/:id - debe devolverme 404 al intentarlo', async () => {
        const response = await request(app).delete('/api/players/3003');

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
    })

});
