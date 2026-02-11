jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');
const logger = require('../src/utils/logger');

describe('AUTH API', () => {
    const unique = Date.now();
    const userData = {
        username: `user_test_${unique}`,
        email: `user_test_${unique}@mail.com`,
        password: 'Password123!'
    };

    afterAll(async () => {
        if (db.end) await db.end();
    });

    test('POST /api/auth/register - debe registrar un usuario', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(userData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Usuario creado correctamente');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('username', userData.username);
        expect(res.body.user).toHaveProperty('email', userData.email);
        expect(res.body.user).not.toHaveProperty('password');
    });

    test('POST /api/auth/register - debe responder 400 si faltan datos', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'x' });

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ error: 'Datos incompletos' });
    });

    test('POST /api/auth/register - debe responder 500 si ocurre error de BD', async () => {
        jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'juan',
                email: 'juan@mail.com',
                password: '123456'
            });

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Error al registrar usuario' });
        expect(logger.error).toHaveBeenCalled();

        db.query.mockRestore();
    });

    test('POST /api/auth/login - debe iniciar sesión y devolver token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: userData.password });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body.token.length).toBeGreaterThan(10);
    });

    test('POST /api/auth/login - debe responder 401 si el email no existe', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'noexiste@mail.com', password: 'Password123!' });

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Credenciales inválidas' });
    });

    test('POST /api/auth/login - debe responder 401 si la contraseña es incorrecta', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: userData.email, password: 'otraContra' });

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Credenciales inválidas' });
    });

    test('POST /api/auth/login - debe responder 500 si ocurre error de BD', async () => {
        jest.spyOn(db, 'query').mockRejectedValueOnce(new Error('DB failure'));

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'algo@mail.com', password: '123' });

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ error: 'Error al iniciar sesión' });
        expect(logger.error).toHaveBeenCalled();

        db.query.mockRestore();
    });
});
