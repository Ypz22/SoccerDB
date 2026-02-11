// soccer.service.spec.ts
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { SoccerService } from './services'; // ajusta si tu archivo se llama distinto

describe('SoccerService', () => {
  let service: SoccerService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://backendsoccerdb.onrender.com/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SoccerService]
    });

    service = TestBed.inject(SoccerService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('login debe hacer POST /auth/login y guardar token si viene en respuesta', () => {
    spyOn(localStorage, 'setItem');

    const credentials = { email: 'a@mail.com', password: '123' };

    service.login(credentials).subscribe(res => {
      expect(res.token).toBe('abc123');
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);

    req.flush({ token: 'abc123' });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'abc123');
  });

  it('login NO debe guardar token si no viene token en respuesta', () => {
    spyOn(localStorage, 'setItem');

    service.login({ email: 'a@mail.com', password: '123' }).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    req.flush({ ok: true });

    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('register debe hacer POST /auth/register', () => {
    const user = { username: 'u', email: 'u@mail.com', password: '123' };

    service.register(user).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);

    req.flush({ ok: true });
  });

  it('logout debe remover token del localStorage', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('isAuthenticated debe devolver true si existe token', () => {
    localStorage.setItem('token', 't');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('isAuthenticated debe devolver false si NO existe token', () => {
    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('getToken debe retornar el token del localStorage', () => {
    localStorage.setItem('token', 'xyz');
    expect(service.getToken()).toBe('xyz');
  });

  // ---- Players ----
  it('getPlayers debe hacer GET /players', () => {
    service.getPlayers().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/players`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('addPlayer debe hacer POST /players', () => {
    const data = { nombre: 'Luis' };

    service.addPlayer(data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/players`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
  });

  it('deletePlayer debe hacer DELETE /players/:id', () => {
    service.deletePlayer(7).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/players/7`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ ok: true });
  });

  it('updatePlayer debe hacer PUT /players/:id', () => {
    const data = { club: 'BSC' };

    service.updatePlayer(7, data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/players/7`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
  });

  // ---- Teams ----
  it('getTeams debe hacer GET /teams', () => {
    service.getTeams().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/teams`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('addTeam debe hacer POST /teams', () => {
    const data = { name: 'Barcelona' };

    service.addTeam(data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/teams`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
  });

  it('deleteTeam debe hacer DELETE /teams/:id', () => {
    service.deleteTeam(3).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/teams/3`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ ok: true });
  });

  it('updateTeam debe hacer PUT /teams/:id', () => {
    const data = { city: 'Quito' };

    service.updateTeam(3, data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/teams/3`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
  });

  // ---- Directors ----
  it('getDirectors debe hacer GET /directors', () => {
    service.getDirectors().subscribe();

    const req = httpMock.expectOne(`${apiUrl}/directors`);
    expect(req.request.method).toBe('GET');

    req.flush([]);
  });

  it('addDirector debe hacer POST /directors', () => {
    const data = { name: 'DT' };

    service.addDirector(data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/directors`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
  });

  it('deleteDirector debe hacer DELETE /directors/:id', () => {
    service.deleteDirector(5).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/directors/5`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ ok: true });
  });

  it('updateDirector debe hacer PUT /directors/:id', () => {
    const data = { currentTeam: 'IDV' };

    service.updateDirector(5, data).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/directors/5`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(data);

    req.flush({ ok: true });
  });
});
