const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

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

//Obtener todos los jugadores
test('GET /api/players - debe devolver jugadores', async () => {
    const response = await request(app).get('/api/players');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
});

//Obtener jugador por ID
test('GET /api/players/:id - debe devolver jugador especifico', async () => {
    const response = await request(app).get(`/api/players/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', createdId);
});

//crear nuevo jugador
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

//error al crear por datos faltantes
test('POST /api/players - error por datos incompletos', async () => {
    const jugadorInvalido = { nombre: "" };

    const response = await request(app)
        .post('/api/players')
        .send(jugadorInvalido);

    expect(response.statusCode).toBe(500);
});

//actualizar jugador
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

//error al actualizar jugador inexistente
test('PUT /api/players/:id - error por id no existente', async () => {
    const response = await request(app)
        .put('/api/players/99999')
        .send({
            nombre: "Nada",
            apellido: "X",
            edad: 20,
            altura: 1.70,
            pierna_buena: "Derecha",
            club: "Ninguno"
        });

    expect(response.statusCode).toBe(404);
});

//eliminar jugador
test('DELETE /api/players/:id - deberia borrar un jugador', async () => {
    const response = await request(app)
        .delete(`/api/players/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
});

//error al eliminar jugador inexistente
test('DELETE /api/players/:id - error al eliminar inexistente', async () => {
    const response = await request(app)
        .delete('/api/players/99999');

    expect(response.statusCode).toBe(404);
});
