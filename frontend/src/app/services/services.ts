import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SoccerService {
  private apiUrl = 'http://localhost:3000/api'; // Ajustar según el puerto de server.js

  constructor(private http: HttpClient) { }

  // JUGADORES (Players)
  getPlayers(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/players`); }
  addPlayer(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/players`, data); }
  deletePlayer(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/players/${id}`); }
  updatePlayer(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/players/${id}`, data); }

  // EQUIPOS (Teams)
  getTeams(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/teams`); }
  addTeam(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/teams`, data); }
  deleteTeam(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/teams/${id}`); }
  updateTeam(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/teams/${id}`, data); }

  // DIRECTORES (Technical Directors)
  getDirectors(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/directors`); }
  addDirector(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/directors`, data); }
  deleteDirector(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/directors/${id}`); }
  updateDirector(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/directors/${id}`, data); }
}