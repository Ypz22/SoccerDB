// login.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { SoccerService } from '../services/services';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  let soccerServiceSpy: jasmine.SpyObj<SoccerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    soccerServiceSpy = jasmine.createSpyObj<SoccerService>('SoccerService', ['login', 'register']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent], // standalone
      providers: [
        { provide: SoccerService, useValue: soccerServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // valores por defecto para no romper tests que no setean retorno
    soccerServiceSpy.login.and.returnValue(of(true));
    soccerServiceSpy.register.and.returnValue(of(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleMode debe alternar isLoginMode y limpiar errorMessage', () => {
    component.isLoginMode = true;
    component.errorMessage = 'algo';

    component.toggleMode();

    expect(component.isLoginMode).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('onSubmit (login) debe llamar soccerService.login con email/password y navegar a /home', () => {
    soccerServiceSpy.login.and.returnValue(of(true));

    component.isLoginMode = true;
    component.authData.email = 'a@mail.com';
    component.authData.password = '123';

    component.onSubmit();

    expect(soccerServiceSpy.login).toHaveBeenCalledTimes(1);
    expect(soccerServiceSpy.login).toHaveBeenCalledWith({
      email: 'a@mail.com',
      password: '123',
    });

    expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('onSubmit (login) debe setear errorMessage si login falla', () => {
    soccerServiceSpy.login.and.returnValue(throwError(() => new Error('fail')));

    component.isLoginMode = true;
    component.authData.email = 'a@mail.com';
    component.authData.password = '123';

    component.onSubmit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Credenciales inválidas');
  });

  it('onSubmit (register) debe llamar soccerService.register(authData) y setear modo login + mensaje éxito', () => {
    soccerServiceSpy.register.and.returnValue(of(true));

    component.isLoginMode = false;
    component.authData.username = 'jeff';
    component.authData.email = 'nuevo@mail.com';
    component.authData.password = '123';

    component.onSubmit();

    expect(soccerServiceSpy.register).toHaveBeenCalledTimes(1);
    expect(soccerServiceSpy.register).toHaveBeenCalledWith(component.authData);

    expect(component.isLoginMode).toBe(true);
    expect(component.errorMessage).toBe('Registro exitoso. Por favor inicia sesión.');
  });

  it('onSubmit (register) debe setear errorMessage si register falla', () => {
    soccerServiceSpy.register.and.returnValue(throwError(() => new Error('fail')));

    component.isLoginMode = false;
    component.authData.username = 'jeff';
    component.authData.email = 'nuevo@mail.com';
    component.authData.password = '123';

    component.onSubmit();

    expect(component.errorMessage).toBe('Error al registrar usuario');
  });
});
