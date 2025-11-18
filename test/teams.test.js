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
        .post('/api/teams')
        .send({
            name: "Barcelona Sporting Club",
            city: "Guayaquil",
            stadium: "Estadio Monumental",
            year_foundation: 1925
        });

    createdId = res.body.id;
});

afterAll(async () => {
    if (db.end) await db.end();
});

test('GET /api/teams - debe devolver equipos ecuatorianos', async () => {
    const response = await request(app).get('/api/teams');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const ldu = response.body.find(t => t.name.includes("Liga"));
    expect(ldu).toBeDefined();
});

test('GET /api/teams/:id - debe devolver equipo específico ecuatoriano', async () => {
    const response = await request(app).get(`/api/teams/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', createdId);
});

test('GET /api/teams/:id - debe responder 404 si el equipo no existe', async () => {
    const response = await request(app).get('/api/teams/99999999');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'Team not found' });
});


test('GET /api/teams/:id - debe responder 500 si ocurre un error en la BD', async () => {
    // Forzamos error en la consulta
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).get('/api/teams/1');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Error fetching team' });

    // logger.error debe ser llamado
    expect(logger.error).toHaveBeenCalled();

    // Restaurar función original
    db.query.mockRestore();
});

test('POST /api/teams - debe crear un equipo ecuatoriano', async () => {
    const newTeam = {
        name: "Emelec",
        city: "Guayaquil",
        stadium: "Estadio Capwell",
        year_foundation: 1929
    };

    const response = await request(app)
        .post('/api/teams')
        .send(newTeam);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
});

test('POST /api/teams - error por datos incompletos', async () => {
    const response = await request(app)
        .post('/api/teams')
        .send({ name: "" });

    expect(response.statusCode).toBe(400);
});

test('PUT /api/teams/:id - debe actualizar equipo ecuatoriano', async () => {
    const changes = {
        name: "Barcelona SC Actualizado",
        city: "Guayaquil",
        stadium: "Estadio Monumental Banco Pichincha",
        year_foundation: 1925
    };

    const response = await request(app)
        .put(`/api/teams/${createdId}`)
        .send(changes);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe("Barcelona SC Actualizado");
});

test('PUT /api/teams/:id - error por id no existente', async () => {
    const response = await request(app)
        .put('/api/teams/999999')
        .send({
            name: "Equipo Falso",
            city: "Ninguna",
            stadium: "Ninguno",
            year_foundation: 2000
        });

    expect(response.statusCode).toBe(404);
});

test('DELETE /api/teams/:id - debe borrar un equipo ecuatoriano', async () => {
    const response = await request(app)
        .delete(`/api/teams/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
});

test('DELETE /api/teams/:id - error al eliminar inexistente', async () => {
    const response = await request(app).delete('/api/teams/999999');

    expect(response.statusCode).toBe(404);
});
