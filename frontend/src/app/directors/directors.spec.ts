import { TestBed } from '@angular/core/testing';
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorsComponent, CommonModule, FormsModule],
      providers: [{ provide: SoccerService, useClass: SoccerServiceMock }]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render main title', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Gestión de Directores Técnicos');
  });

  it('debe mostrar todos los inputs del formulario', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(7);
  });

  it('debe mostrar el botón de agregar', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    const btn = fixture.nativeElement.querySelector('button.btn-add');
    expect(btn).toBeTruthy();
  });

  it('debe cargar y mostrar la lista inicial de directores', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los encabezados correctos de la tabla', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('table th'));
    const texts = headers.map(h => h.nativeElement.textContent.trim());
    expect(texts).toEqual([
      'ID',
      'Nombre',
      'Nacionalidad',
      'Equipo Actual',
      'Email',
      'Acciones'
    ]);
  });

  it('debe actualizar el modelo newDirector.name', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    const component = fixture.componentInstance;

    component.newDirector.name = 'Nuevo DT';
    fixture.detectChanges();

    expect(component.newDirector.name).toBe('Nuevo DT');
  });


  it('debe llamar a saveDirector al enviar el formulario', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    const component = fixture.componentInstance;
    spyOn(component, 'saveDirector');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.saveDirector).toHaveBeenCalled();
  });

  it('debe mostrar el icono de eliminar por cada director', () => {
    const fixture = TestBed.createComponent(DirectorsComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.fa-trash');
    expect(icons.length).toBe(2);
  });

});
