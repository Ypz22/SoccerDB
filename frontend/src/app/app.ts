import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SoccerService } from './services/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(
    public soccerService: SoccerService,
    private router: Router
  ) { }
  onLogout() {
    this.soccerService.logout();
    this.router.navigate(['/login']);
  }
}
