import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SoccerService } from '../services/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  isLoginMode = true;
  authData = {
    username: '',
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(private soccerService: SoccerService, private router: Router) { }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.soccerService.login({ email: this.authData.email, password: this.authData.password })
        .subscribe({
          next: () => this.router.navigate(['/home']),
          error: (err) => this.errorMessage = 'Credenciales inválidas'
        });
    } else {
      this.soccerService.register(this.authData)
        .subscribe({
          next: () => {
            this.isLoginMode = true;
            this.errorMessage = 'Registro exitoso. Por favor inicia sesión.';
          },
          error: (err) => this.errorMessage = 'Error al registrar usuario'
        });
    }
  }
}