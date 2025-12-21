import { Component, OnInit } from '@angular/core';
import { SoccerService } from '../services/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-players',
  templateUrl: './players.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./players.css']
})
export class PlayersComponent implements OnInit {
  players: any[] = [];
  newPlayer = { nombre: '', apellido: '', edad: null, altura: null, pierna_buena: '', club: '' };

  constructor(private soccerService: SoccerService) { }

  ngOnInit() { this.loadPlayers(); }

  loadPlayers() {
    this.soccerService.getPlayers().subscribe(res => {
      this.players = res.sort((a, b) => a.id - b.id);
    });
  }

  savePlayer() {
    this.soccerService.addPlayer(this.newPlayer).subscribe(() => {
      this.loadPlayers();
      this.newPlayer = { nombre: '', apellido: '', edad: null, altura: null, pierna_buena: '', club: '' };
    });
  }

  deletePlayer(id: number) {
    if (confirm('¿Eliminar jugador?')) {
      this.soccerService.deletePlayer(id).subscribe(() => this.loadPlayers());
    }
  }
}