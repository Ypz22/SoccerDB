import { Routes } from '@angular/router';
import { PlayersComponent } from './players/players';
import { TeamsComponent } from './teams/teams';
import { DirectorsComponent } from './directors/directors';
import { HomeComponent } from './home/home';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login';

export const routes: Routes = [
    { path: 'login', component: LoginComponent }, // Ruta para loggearse
    { path: 'home', component: HomeComponent, canActivate: [authGuard] },
    { path: 'players', component: PlayersComponent, canActivate: [authGuard] },
    { path: 'teams', component: TeamsComponent, canActivate: [authGuard] },
    { path: 'directors', component: DirectorsComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'home' }
];
