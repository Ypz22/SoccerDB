jest.mock('jsonwebtoken', () => ({
    verify: jest.fn()
}));

jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

const jwt = require('jsonwebtoken');
const logger = require('../src/utils/logger');
const authMiddleware = require('../src/middleware/auth.middleware.js'); // ajusta path

const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('authMiddleware', () => {
    let originalEnv;

    beforeAll(() => {
        originalEnv = process.env.NODE_ENV;
    });

    afterAll(() => {
        process.env.NODE_ENV = originalEnv;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        delete process.env.NODE_ENV;
    });

    test('debe saltarse autenticación en modo test y asignar req.user fijo', () => {
        process.env.NODE_ENV = 'test';

        const req = { headers: {} };
        const res = makeRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(req.user).toEqual({ id: 1 });
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
        expect(jwt.verify).not.toHaveBeenCalled();
    });

    test('debe responder 401 si no se proporciona header Authorization', () => {
        process.env.NODE_ENV = 'development';

        const req = { headers: {} };
        const res = makeRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token no proporcionado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('debe llamar next y asignar req.user si token es válido', () => {
        process.env.NODE_ENV = 'development';

        const decoded = { id: 7, email: 'a@mail.com', role: 'user' };
        jwt.verify.mockReturnValueOnce(decoded);

        const req = {
            headers: { authorization: 'Bearer token_valido_123' }
        };
        const res = makeRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(
            'token_valido_123',
            'KJHf83kjsd9F!@#23kslD9fjs8FJsl39@!'
        );
        expect(req.user).toEqual(decoded);
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test('debe responder 403 y loggear error si token es inválido/expirado', () => {
        process.env.NODE_ENV = 'development';

        jwt.verify.mockImplementationOnce(() => {
            throw new Error('invalid token');
        });

        const req = {
            headers: { authorization: 'Bearer token_malo' }
        };
        const res = makeRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(logger.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
        expect(next).not.toHaveBeenCalled();
    });

    test('debe responder 403 si Authorization no tiene token (Bearer sin token)', () => {
        process.env.NODE_ENV = 'development';

        // "Bearer" sin segundo segmento -> token undefined
        jwt.verify.mockImplementationOnce(() => {
            throw new Error('jwt must be provided');
        });

        const req = {
            headers: { authorization: 'Bearer' }
        };
        const res = makeRes();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalled(); // se intenta verificar y falla
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado' });
        expect(next).not.toHaveBeenCalled();
    });
});
