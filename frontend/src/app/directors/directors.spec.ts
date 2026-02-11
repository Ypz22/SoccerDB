// directors.component.spec.ts
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DirectorsComponent } from './directors';
import { SoccerService } from '../services/services';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class SoccerServiceMock {
  getDirectors() {
    return of([
      { id: 1, name: 'DT 1', nationality: 'EC', currentTeam: 'Equipo A', email: 'dt1@mail.com' },
      { id: 2, name: 'DT 2', nationality: 'AR', currentTeam: 'Equipo B', email: 'dt2@mail.com' }
    ]);
  }

  addDirector() {
    return of({});
  }

  deleteDirector() {
    return of({});
  }
}

describe('DirectorsComponent', () => {
  let fixture: ComponentFixture<DirectorsComponent>;
  let component: DirectorsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorsComponent, CommonModule, FormsModule],
      providers: [{ provide: SoccerService, useClass: SoccerServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(DirectorsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render main title', () => {
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Gestión de Directores Técnicos');
  });

  it('debe mostrar todos los inputs del formulario', () => {
    fixture.detectChanges();
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(7);
  });

  it('debe mostrar el botón de agregar', () => {
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button.btn-add');
    expect(btn).toBeTruthy();
  });

  it('debe cargar y mostrar la lista inicial de directores', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los encabezados correctos de la tabla', () => {
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('table th'));
    const texts = headers.map(h => h.nativeElement.textContent.trim());
    expect(texts).toEqual(['ID', 'Nombre', 'Nacionalidad', 'Equipo Actual', 'Email', 'Acciones']);
  });

  it('ngOnInit debe llamar loadDirectors()', () => {
    spyOn(component, 'loadDirectors');
    component.ngOnInit();
    expect(component.loadDirectors).toHaveBeenCalled();
  });

  it('loadDirectors debe ordenar por id', () => {
    component.loadDirectors();
    expect(component.directors.map(d => d.id)).toEqual([1, 2]);
  });

  it('saveDirector debe llamar servicio y resetear formulario', () => {
    const service = TestBed.inject(SoccerService);
    spyOn(service, 'addDirector').and.callThrough();
    spyOn(component, 'loadDirectors').and.callThrough();
    spyOn(component, 'resetForm').and.callThrough();

    component.saveDirector();

    expect(service.addDirector).toHaveBeenCalled();
    expect(component.loadDirectors).toHaveBeenCalled();
    expect(component.resetForm).toHaveBeenCalled();
  });

  it('deleteDirector debe llamar servicio si confirm = true', () => {
    const service = TestBed.inject(SoccerService);
    spyOn(service, 'deleteDirector').and.callThrough();
    spyOn(component, 'loadDirectors').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteDirector(1);

    expect(service.deleteDirector).toHaveBeenCalledWith(1);
    expect(component.loadDirectors).toHaveBeenCalled();
  });

  it('deleteDirector NO debe llamar servicio si confirm = false', () => {
    const service = TestBed.inject(SoccerService);
    spyOn(service, 'deleteDirector').and.callThrough();
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteDirector(1);

    expect(service.deleteDirector).not.toHaveBeenCalled();
  });

  it('resetForm debe limpiar el formulario', () => {
    component.newDirector.name = 'DT';
    component.resetForm();
    expect(component.newDirector.name).toBe('');
  });

  // =========================================================
  // ✅ PRUEBAS AÑADIDAS (load/save/reset) — integradas
  // =========================================================

  it('loadDirectors debe llamar getDirectors y ordenar por id ascendente', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(service, 'getDirectors').and.returnValue(
      of([{ id: 3 }, { id: 1 }, { id: 2 }] as any[])
    );

    component.loadDirectors();

    expect(service.getDirectors).toHaveBeenCalledTimes(1);
    expect(component.directors.map(d => d.id)).toEqual([1, 2, 3]);
  });

  it('saveDirector debe llamar addDirector(newDirector) y luego loadDirectors + resetForm', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(service, 'addDirector').and.returnValue(of({}));
    spyOn(component, 'loadDirectors'); // no callThrough, solo verificar que se llama
    spyOn(component, 'resetForm');     // no callThrough para evitar mutar newDirector

    component.newDirector = {
      name: 'DT',
      nationality: 'EC',
      age: null,
      currentTeam: 'Equipo',
      yearsExperience: null,
      email: 'dt@mail.com',
      cellphone: '0991234567',
    };

    component.saveDirector();

    expect(service.addDirector).toHaveBeenCalledTimes(1);
    expect(service.addDirector).toHaveBeenCalledWith(component.newDirector);

    expect(component.loadDirectors).toHaveBeenCalledTimes(1);
    expect(component.resetForm).toHaveBeenCalledTimes(1);
  });


  it('resetForm debe reiniciar newDirector a valores vacíos', () => {
    component.newDirector = {
      name: 'X',
      nationality: 'Y',
      age: null,
      currentTeam: 'Z',
      yearsExperience: null,
      email: 'x@mail.com',
      cellphone: '099',
    };

    component.resetForm();

    expect(component.newDirector).toEqual({
      name: '',
      nationality: '',
      age: null,
      currentTeam: '',
      yearsExperience: null,
      email: '',
      cellphone: '',
    });
  });
});
