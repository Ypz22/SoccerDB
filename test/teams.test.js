const request = require('supertest');
const app = require('../src/app');
const ConnectDB = require('../src/config/db');

jest.mock('../src/config/db');

describe('Teams API Endpoints', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/teams - should return array of teams', async () => {
        const mockTeams = [
            { id: 1, name: "Barcelona", city: "Barcelona", stadium: "Camp Nou", year_foundation: 1899 },
            { id: 2, name: "Real Madrid", city: "Madrid", stadium: "Santiago Bernabéu", year_foundation: 1902 },
        ];

        ConnectDB.query.mockResolvedValue({ rows: mockTeams });

        const res = await request(app).get('/api/teams');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockTeams);
    });

    test('POST /api/teams - should create a new team', async () => {
        const newTeam = {
            name: "Liverpool",
            city: "Liverpool",
            stadium: "Anfield",
            year_foundation: 1892
        };

        ConnectDB.query.mockResolvedValue({ rows: [{ id: 10, ...newTeam }] });

        const res = await request(app).post('/api/teams').send(newTeam);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe("Liverpool");
        expect(res.body).toHaveProperty("id");
    });

    test('POST /api/teams - incomplete fields should fail', async () => {
        const res = await request(app)
            .post('/api/teams')
            .send({ name: "TEST" });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", "Failed to add team");
    });

    test('PUT /api/teams/:id - should update a team', async () => {
        const updatedTeam = {
            id: 5,
            name: "Chelsea",
            city: "London",
            stadium: "Stamford Bridge",
            year_foundation: 1905
        };

        ConnectDB.query.mockResolvedValue({ rows: [updatedTeam] });

        const res = await request(app)
            .put('/api/teams/5')
            .send(updatedTeam);

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Chelsea");
    });

    test('PUT /api/teams/:id - should return 404 if team not found', async () => {
        ConnectDB.query.mockResolvedValue({ rows: [] });

        const res = await request(app)
            .put('/api/teams/999')
            .send({
                name: "Fake Team",
                city: "Fake City",
                stadium: "Fake Stadium",
                year_foundation: 2000
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Team not found");
    });

    test('DELETE /api/teams/:id - should delete a team', async () => {
        ConnectDB.query.mockResolvedValue({
            rows: [{ id: 1 }]
        });

        const res = await request(app).delete('/api/teams/1');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Team deleted successfully");
    });

    test('DELETE /api/teams/:id - should return 404 if not found', async () => {
        ConnectDB.query.mockResolvedValue({ rows: [] });

        const res = await request(app).delete('/api/teams/1000');

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty("error", "Team not found");
    });
});
