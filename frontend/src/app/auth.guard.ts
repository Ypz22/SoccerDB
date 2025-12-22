import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SoccerService } from './services/services';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(SoccerService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};