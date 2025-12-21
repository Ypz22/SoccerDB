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
        .post('/api/directors')
        .send({
            name: "DT Inicial Test",
            nationality: "Ecuatoriano",
            age: 45,
            currentTeam: "Barcelona SC",
            yearsExperience: 15,
            email: "dt.inicial.test@club.com",
            cellphone: "0991234567"
        });
    createdId = res.body.id;
});

afterAll(async () => {
    if (db.end) await db.end();
});

test('GET /api/directors - debe devolver Directores Técnicos', async () => {
    const response = await request(app).get('/api/directors');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
});


test('GET /api/directors/:id - debe devolver un Director Técnico específico', async () => {
    const response = await request(app).get(`/api/directors/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id', createdId);
});

test('GET /api/directors/:id - debe responder 404 si el director no existe', async () => {
    const response = await request(app).get('/api/directors/99999999');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: 'Director no encontrado' });
});

test('GET /api/directors - debe responder 500 si ocurre un error en la BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).get('/api/directors');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch directors' });

    expect(logger.error).toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toBe('Failed to fetch directors:');

    db.query.mockRestore();
});

test('GET /api/directors/:id - debe responder 500 si ocurre un error en la BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).get('/api/directors/1');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Error al obtener director' });

    expect(logger.error).toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toBe('Failed to fetch directors:');

    db.query.mockRestore();
});


test('POST /api/directors - debe crear un nuevo Director Técnico', async () => {
    const nuevoDirector = {
        name: "Nuevo DT Único " + Date.now(),
        nationality: "Argentino",
        age: 50,
        currentTeam: "Independiente del Valle",
        yearsExperience: 10,
        email: "nuevo.dt@club.com",
        cellphone: "0997654321"
    };

    const response = await request(app)
        .post('/api/directors')
        .send(nuevoDirector);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
});

test('POST /api/directors  - error por datos incompletos', async () => {
    const directorInvalido = { name: "" };

    const response = await request(app)
        .post('/api/directors')
        .send(directorInvalido);

    expect(response.statusCode).toBe(500);
});

test('POST /api/directors - debe responder 500 si ocurre un error en la BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const directorData = {
        name: 'Juan Perez',
        nationality: 'Ecuatoriana',
        age: 45,
        currentTeam: 'Barcelona SC',
        yearsExperience: 20,
        email: 'juan@example.com',
        cellphone: '0999999999'
    };

    const response = await request(app)
        .post('/api/directors')
        .send(directorData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to add Technical Director' });
    expect(logger.error).toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toBe('Failed to fetch directors:');

    db.query.mockRestore();
});


test('PUT /api/directors/:id - debe actualizar un Director Técnico existente', async () => {
    const cambios = {
        name: "DT Actualizado",
        nationality: "Update",
        age: 55,
        currentTeam: "Team Update",
        yearsExperience: 20,
        email: "dt.updated@club.com",
        cellphone: "0995555555"
    };

    const response = await request(app)
        .put(`/api/directors/${createdId}`)
        .send(cambios);

    expect(response.statusCode).toBe(200);
});

test('PUT /api/directors/:id - debe responder 500 si ocurre un error en la BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app)
        .put('/api/directors/1')
        .send({
            name: 'Juan Perez',
            nationality: 'Ecuatoriana',
            age: 46,
            currentTeam: 'Barcelona SC',
            yearsExperience: 21,
            email: 'juan@example.com',
            cellphone: '0999999999'
        });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to update Technical Director' });
    expect(logger.error).toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toBe('Failed to fetch directors:');

    db.query.mockRestore();
});



test('PUT /api/directors/:id - error por id no existente', async () => {
    const response = await request(app)
        .put('/api/directors/99999')
        .send({
            name: "Nada",
            nationality: "X",
            age: 55,
            currentTeam: "SOLA",
            yearsExperience: 20,
            email: "dt.updated@club.com",
            cellphone: "0995555555"
        });

    expect(response.statusCode).toBe(404);
});



test('DELETE /api/directors/:id - debe borrar el Director Técnico creado inicialmente', async () => {
    const response = await request(app)
        .delete(`/api/directors/${createdId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
});

test('DELETE /api/directors/:id - debe responder 500 si ocurre un error en la BD', async () => {
    jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app).delete('/api/directors/1');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to delete Technical Director' });
    expect(logger.error).toHaveBeenCalled();
    expect(logger.error.mock.calls[0][0]).toBe('Failed to fetch directors:');

    db.query.mockRestore();
});


test('DELETE /api/directors/:id - debe retornar 404 al intentar eliminar un DT inexistente', async () => {
    const response = await request(app)
        .delete('/api/directors/9999999');

    expect(response.statusCode).toBe(404);
});