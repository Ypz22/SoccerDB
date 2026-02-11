// app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { SoccerService } from './services/services';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('App Component', () => {
  let soccerServiceSpy: jasmine.SpyObj<SoccerService>;
  let router: Router;

  beforeEach(async () => {
    soccerServiceSpy = jasmine.createSpyObj<SoccerService>('SoccerService', ['login', 'logout']);
    soccerServiceSpy.login.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [
        App,
        // ✅ esto provee Router, ActivatedRoute, RouterLink, RouterOutlet, RouterLinkActive, etc.
        RouterTestingModule.withRoutes([]),
      ],
      providers: [{ provide: SoccerService, useValue: soccerServiceSpy }],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('footer p')?.textContent)
      .toContain('© 2025 Soccer DB | All rights reserved');
  });

  it('onLogout debe llamar logout() y navegar a /login', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;

    const navigateSpy = spyOn(router, 'navigate');

    component.onLogout();

    expect(soccerServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
