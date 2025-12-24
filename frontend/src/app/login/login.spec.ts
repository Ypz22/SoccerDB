import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { SoccerService } from '../services/services';
import { Router } from '@angular/router';
import { of } from 'rxjs';

// Mock del servicio
class SoccerServiceMock {
  login() {
    return of(true);
  }
  register() {
    return of(true);
  }
}

// Mock del router
class RouterMock {
  navigate() { }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent], // componente standalone
      providers: [
        { provide: SoccerService, useClass: SoccerServiceMock },
        { provide: Router, useClass: RouterMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
