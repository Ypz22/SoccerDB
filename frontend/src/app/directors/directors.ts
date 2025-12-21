import { Component, OnInit } from '@angular/core';
import { SoccerService } from '../services/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-directors',
  templateUrl: './directors.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./directors.css']
})
export class DirectorsComponent implements OnInit {
  directors: any[] = [];
  newDirector = { name: '', nationality: '', age: null, currentTeam: '', yearsExperience: null, email: '', cellphone: '' };

  constructor(private soccerService: SoccerService) { }

  ngOnInit() { this.loadDirectors(); }

  loadDirectors() {
    this.soccerService.getDirectors().subscribe(res => {
      this.directors = res.sort((a, b) => a.id - b.id);
    });
  }

  saveDirector() {
    this.soccerService.addDirector(this.newDirector).subscribe(() => {
      this.loadDirectors();
      this.resetForm();
    });
  }

  deleteDirector(id: number) {
    if (confirm(`¿Eliminar Director Técnico con ID ${id}?`)) {
      this.soccerService.deleteDirector(id).subscribe(() => this.loadDirectors());
    }
  }

  resetForm() {
    this.newDirector = { name: '', nationality: '', age: null, currentTeam: '', yearsExperience: null, email: '', cellphone: '' };
  }
}