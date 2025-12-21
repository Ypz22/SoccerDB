import { Component, OnInit } from '@angular/core';
import { SoccerService } from '../services/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./teams.css']
})
export class TeamsComponent implements OnInit {
  teams: any[] = [];
  newTeam = { name: '', city: '', stadium: '', year_foundation: null };

  constructor(private soccerService: SoccerService) { }

  ngOnInit() { this.loadTeams(); }

  loadTeams() {
    this.soccerService.getTeams().subscribe(res => {
      this.teams = res.sort((a, b) => a.id - b.id);
    });
  }

  saveTeam() {
    this.soccerService.addTeam(this.newTeam).subscribe(() => {
      this.loadTeams();
      this.newTeam = { name: '', city: '', stadium: '', year_foundation: null };
    });
  }

  deleteTeam(id: number) {
    if (confirm('¿Eliminar equipo?')) {
      this.soccerService.deleteTeam(id).subscribe(() => this.loadTeams());
    }
  }
}