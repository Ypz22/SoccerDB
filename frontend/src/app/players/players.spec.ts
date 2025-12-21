import { TestBed } from '@angular/core/testing';
import { PlayersComponent } from './players';
import { SoccerService } from '../services/services';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

class SoccerServiceMock {
  getPlayers() {
    return of([
      {
        id: 1,
        nombre: 'Enner',
        apellido: 'Valencia',
        edad: 34,
        altura: 1.77,
        pierna_buena: 'Derecha',
        club: 'Internacional'
      },
      {
        id: 2,
        nombre: 'Moisés',
        apellido: 'Caicedo',
        edad: 22,
        altura: 1.72,
        pierna_buena: 'Derecha',
        club: 'Chelsea'
      }
    ]);
  }

  addPlayer() {
    return of({});
  }

  deletePlayer() {
    return of({});
  }
}

describe('PlayersComponent - Jugadores Ecuatorianos', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersComponent, CommonModule, FormsModule],
      providers: [{ provide: SoccerService, useClass: SoccerServiceMock }]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debe mostrar el título principal', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1.title');
    expect(h1.textContent).toContain('Gestión de Jugadores');
  });

  it('debe mostrar el formulario de jugadores', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('debe mostrar todos los inputs del formulario', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(6);
  });

  it('debe mostrar el botón de agregar jugador', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    const btn = fixture.nativeElement.querySelector('button.btn-add');
    expect(btn).toBeTruthy();
  });

  it('debe cargar y mostrar la lista inicial de jugadores ecuatorianos', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los encabezados correctos de la tabla', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('table th'));
    const texts = headers.map(h => h.nativeElement.textContent.trim());
    expect(texts).toEqual([
      'ID',
      'Nombre',
      'Apellido',
      'Edad',
      'Altura',
      'Pierna',
      'Club',
      'Acciones'
    ]);
  });

  it('debe actualizar el modelo newPlayer.nombre', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    const component = fixture.componentInstance;

    component.newPlayer.nombre = 'Piero';
    fixture.detectChanges();

    expect(component.newPlayer.nombre).toBe('Piero');
  });


  it('debe llamar a savePlayer al enviar el formulario', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    const component = fixture.componentInstance;
    spyOn(component, 'savePlayer');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.savePlayer).toHaveBeenCalled();
  });

  it('debe mostrar un icono de eliminar por cada jugador', () => {
    const fixture = TestBed.createComponent(PlayersComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.fa-trash');
    expect(icons.length).toBe(2);
  });

});
