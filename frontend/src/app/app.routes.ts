import { Routes } from '@angular/router';
import { PlayersComponent } from './players/players';
import { TeamsComponent } from './teams/teams';
import { DirectorsComponent } from './directors/directors';
import { HomeComponent } from './home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'players', component: PlayersComponent },
    { path: 'teams', component: TeamsComponent },
    { path: 'directors', component: DirectorsComponent },
    { path: '**', redirectTo: '' }
];
