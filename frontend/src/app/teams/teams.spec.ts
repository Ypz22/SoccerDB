import { TestBed } from '@angular/core/testing';
import { TeamsComponent } from './teams';
import { SoccerService } from '../services/services';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class SoccerServiceMock {
  getTeams() {
    return of([
      {
        id: 1,
        name: 'Barcelona SC',
        city: 'Guayaquil',
        stadium: 'Monumental Isidro Romero Carbo',
        year_foundation: 1925
      },
      {
        id: 2,
        name: 'LDU Quito',
        city: 'Quito',
        stadium: 'Rodrigo Paz Delgado',
        year_foundation: 1930
      }
    ]);
  }

  addTeam() {
    return of({});
  }

  deleteTeam() {
    return of({});
  }
}

describe('TeamsComponent - Equipos Ecuatorianos', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsComponent, CommonModule, FormsModule],
      providers: [{ provide: SoccerService, useClass: SoccerServiceMock }]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debe mostrar el título principal', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1.title');
    expect(h1.textContent).toContain('Gestión de Equipos');
  });

  it('debe mostrar el formulario de equipos', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('debe mostrar todos los inputs del formulario', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(4);
  });

  it('debe mostrar el botón de agregar equipo', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    const btn = fixture.nativeElement.querySelector('button.btn-add');
    expect(btn).toBeTruthy();
  });

  it('debe cargar y mostrar la lista inicial de equipos ecuatorianos', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los encabezados correctos de la tabla', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('table th'));
    const texts = headers.map(h => h.nativeElement.textContent.trim());
    expect(texts).toEqual([
      'ID',
      'Nombre',
      'Ciudad',
      'Estadio',
      'Año',
      'Acciones'
    ]);
  });

  it('debe actualizar el modelo newTeam.name', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    const component = fixture.componentInstance;

    component.newTeam.name = 'Emelec';
    fixture.detectChanges();

    expect(component.newTeam.name).toBe('Emelec');
  });



  it('debe llamar a saveTeam al enviar el formulario', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    const component = fixture.componentInstance;
    spyOn(component, 'saveTeam');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.saveTeam).toHaveBeenCalled();
  });

  it('debe mostrar un icono de eliminar por cada equipo', () => {
    const fixture = TestBed.createComponent(TeamsComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.fa-trash');
    expect(icons.length).toBe(2);
  });

});
