jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const logger = require('../src/utils/logger');

let createdId;

beforeAll(async () => {
    const res = await request(app)
        .post('/api/players')
        .send({
            nombre: "JugadorTest",
            apellido: "Prueba",
            edad: 22,
            altura: 1.80,
            pierna_buena: "Derecha",
            club: "Barcelona SC"
        });

    createdId = res.body.id;
});

afterAll(async () => {
    if (db.end) await db.end();
});


//Listar con get
test('GET /api/players - debe devolver jugadores', async () => {
    const response = await request(app).get('/api/players');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
});

test('GET /api/players - error BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).get('/api/players');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch players' });
    expect(logger.error).toHaveBeenCalled();

    db.query.mockRestore();
});


//obtener por id
test('GET /api/players/:id - debe devolver jugador especifico', async () => {
    const response = await request(app).get(`/api/players/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', createdId);
});

test('GET /api/players/:id - 404 no existe', async () => {
    const response = await request(app).get('/api/players/999999');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'Player not found' });
});

test('GET /api/players/:id - error BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).get('/api/players/1');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Error fetching player' });

    db.query.mockRestore();
});


//agregar jugadores 
test('POST /api/players - debe crear jugador', async () => {
    const nuevoJugador = {
        nombre: "Nuevo",
        apellido: "Test",
        edad: 20,
        altura: 1.75,
        pierna_buena: "Izquierda",
        club: "Liga de Quito"
    };

    const response = await request(app)
        .post('/api/players')
        .send(nuevoJugador);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
});

test('POST /api/players - error datos incompletos', async () => {
    const response = await request(app)
        .post('/api/players')
        .send({ nombre: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: 'Failed to add player' });
});

test('POST /api/players - error BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app)
        .post('/api/players')
        .send({
            nombre: "X",
            apellido: "X",
            edad: 20,
            altura: 1.70,
            pierna_buena: "Derecha",
            club: "Test"
        });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to add player' });

    db.query.mockRestore();
});


//actualizar jugadores
test('PUT /api/players/:id - debe actualizar jugador', async () => {
    const cambios = {
        nombre: "Actualizado",
        apellido: "Update",
        edad: 23,
        altura: 1.78,
        pierna_buena: "Derecha",
        club: "Emelec"
    };

    const response = await request(app)
        .put(`/api/players/${createdId}`)
        .send(cambios);

    expect(response.statusCode).toBe(200);
});

test('PUT /api/players/:id - 404 si no existe', async () => {
    const response = await request(app)
        .put('/api/players/999999')
        .send({
            nombre: "X",
            apellido: "X",
            edad: 20,
            altura: 1.70,
            pierna_buena: "Derecha",
            club: "Ninguno"
        });

    expect(response.statusCode).toBe(404);
});

test('PUT /api/players/:id - error BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app)
        .put('/api/players/1')
        .send({
            nombre: "X",
            apellido: "X",
            edad: 20,
            altura: 1.70,
            pierna_buena: "Derecha",
            club: "Test"
        });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to update player' });

    db.query.mockRestore();
});


//borrar jugador
test('DELETE /api/players/:id - borrar jugador', async () => {
    const response = await request(app)
        .delete(`/api/players/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
});

test('DELETE /api/players/:id - 404 si no existe', async () => {
    const response = await request(app).delete('/api/players/999999');
    expect(response.statusCode).toBe(404);
});

test('DELETE /api/players/:id - error BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).delete('/api/players/1');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to delete player' });

    db.query.mockRestore();
});
