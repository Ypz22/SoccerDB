const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db'); 


describe('Players API Endpoints - BD Real', () => {

    afterAll(async () => {
        await db.end(); 
    });

    test('GET /api/players - me deberia devolver jugadores reales', async () => {

        const response = await request(app).get('/api/players');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);

        const jugador = response.body.find(j => j.nombre === 'Damián');
        expect(jugador).toBeDefined();
    });
});
