/**
 * Tests para src/config/db.js
 * Ajusta la ruta del require según tu proyecto.
 */

// 1) Mock del logger (si tu db.js usara ../utils/logger)
// En tu código actual usas winston directo. Si quieres mantener el mismo estilo,
// te recomiendo mover logger a src/utils/logger.js y usarlo en db.js.
// Abajo te dejo igual el mock por si ya lo tienes.
jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn(),
}));

// 2) Mock de dotenv (opcional, evita que cargue .env en tests)
jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

// 3) Mock de pg => Pool
const mockQuery = jest.fn();
const mockEnd = jest.fn();

jest.mock('pg', () => {
    return {
        Pool: jest.fn().mockImplementation(() => ({
            query: mockQuery,
            end: mockEnd,
        })),
    };
});

// Importa después de los mocks
const { Pool } = require('pg');
const db = require('../src/config/db'); // ajusta ruta si es otra

describe('DB config (Pool)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Limpia env para probar defaults si quieres
        delete process.env.DB_USER;
        delete process.env.DB_HOST;
        delete process.env.DB_NAME;
        delete process.env.DB_PASSWORD;
        delete process.env.DB_PORT;
    });

    test('debe construir Pool con defaults si no hay variables de entorno', () => {
        // Como el módulo ya fue importado arriba, Pool() ya se ejecutó una vez.
        // Para testear constructor con envs, hay que reimportar el módulo.
        jest.resetModules();

        const { Pool: PoolFresh } = require('pg');
        require('../src/config/db'); // reimport

        expect(PoolFresh).toHaveBeenCalledTimes(1);

        // Verifica parámetros del constructor
        const configArg = PoolFresh.mock.calls[0][0];
        expect(configArg).toMatchObject({
            user: 'admin',
            host: 'localhost',
            database: 'soccerdb',
            password: 'admin',
            port: 5432,
        });
    });

    test('debe construir Pool con variables de entorno si existen', () => {
        jest.resetModules();

        process.env.DB_USER = 'u';
        process.env.DB_HOST = 'h';
        process.env.DB_NAME = 'd';
        process.env.DB_PASSWORD = 'p';
        process.env.DB_PORT = '6543';

        const { Pool: PoolFresh } = require('pg');
        require('../src/config/db');

        expect(PoolFresh).toHaveBeenCalledTimes(1);

        const configArg = PoolFresh.mock.calls[0][0];
        expect(configArg).toMatchObject({
            user: 'u',
            host: 'h',
            database: 'd',
            password: 'p',
            port: '6543', // tu código NO convierte a Number; si quieres que sea número, haz Number(process.env.DB_PORT)
        });
    });

    test('connect() - debe hacer SELECT 1 y no lanzar error', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });

        await expect(db.connect()).resolves.toBeUndefined();
        expect(mockQuery).toHaveBeenCalledWith('SELECT 1');
    });

    test('connect() - debe loguear y lanzar error si falla la BD', async () => {
        const err = new Error('DB failure');
        mockQuery.mockRejectedValueOnce(err);

        await expect(db.connect()).rejects.toThrow('DB failure');
        expect(mockQuery).toHaveBeenCalledWith('SELECT 1');

        // Si en tu db.js usas winston directo, esto no aplica.
        // Si migras a utils/logger, entonces sí:
        // const logger = require('../src/utils/logger');
        // expect(logger.error).toHaveBeenCalled();
    });

    test('query(...) - debe delegar a pool.query con los mismos parámetros', async () => {
        mockQuery.mockResolvedValueOnce({ rows: [] });

        const sql = 'SELECT * FROM users WHERE id = $1';
        const params = [1];

        const res = await db.query(sql, params);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(sql, params);
        expect(res).toEqual({ rows: [] });
    });

    test('end() - debe cerrar el pool', async () => {
        mockEnd.mockResolvedValueOnce();

        await expect(db.end()).resolves.toBeUndefined();
        expect(mockEnd).toHaveBeenCalledTimes(1);
    });
});
