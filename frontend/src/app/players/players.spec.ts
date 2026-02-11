import { TestBed, ComponentFixture } from '@angular/core/testing';
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
  let fixture: ComponentFixture<PlayersComponent>;
  let component: PlayersComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersComponent, CommonModule, FormsModule],
      providers: [{ provide: SoccerService, useClass: SoccerServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el título principal', () => {
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1.title');
    expect(h1.textContent).toContain('Gestión de Jugadores');
  });

  it('debe mostrar el formulario de jugadores', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('debe mostrar todos los inputs del formulario', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(6);
  });

  it('debe mostrar el botón de agregar jugador', () => {
    const btn = fixture.nativeElement.querySelector('button.btn-add');
    expect(btn).toBeTruthy();
  });

  it('debe cargar y mostrar la lista inicial de jugadores ecuatorianos', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los encabezados correctos de la tabla', () => {
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
    component.newPlayer.nombre = 'Piero';
    fixture.detectChanges();
    expect(component.newPlayer.nombre).toBe('Piero');
  });

  it('debe llamar a savePlayer al enviar el formulario', () => {
    spyOn(component, 'savePlayer');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.savePlayer).toHaveBeenCalled();
  });

  it('debe mostrar un icono de eliminar por cada jugador', () => {
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.fa-trash');
    expect(icons.length).toBe(2);
  });

  // =========================================================
  // ✅ PRUEBAS AGREGADAS (savePlayer / deletePlayer)
  // =========================================================

  it('savePlayer debe llamar addPlayer(newPlayer), luego loadPlayers y resetear newPlayer (según estado inicial real)', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(service, 'addPlayer').and.returnValue(of({}));
    spyOn(component, 'loadPlayers').and.callThrough();

    const initialNewPlayer = JSON.parse(JSON.stringify(component.newPlayer));

    const expectedPayload = {
      nombre: 'Luis',
      apellido: 'Diaz',
      edad: 25,
      altura: 1.75,
      pierna_buena: 'Derecha',
      club: 'BSC',
    };

    component.newPlayer = { ...expectedPayload } as any;

    component.savePlayer();

    expect(service.addPlayer).toHaveBeenCalledTimes(1);

    const calledWith = (service.addPlayer as jasmine.Spy).calls.argsFor(0)[0];
    expect(calledWith).toEqual(expectedPayload);

    expect(component.loadPlayers).toHaveBeenCalledTimes(1);
    expect(component.newPlayer).toEqual(initialNewPlayer);
  });



  it('deletePlayer: si confirm=true debe llamar deletePlayer(id) y luego loadPlayers', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(service, 'deletePlayer').and.returnValue(of({}));
    spyOn(component, 'loadPlayers').and.callThrough();

    component.deletePlayer(7);

    expect(window.confirm).toHaveBeenCalledWith('¿Eliminar jugador?');
    expect(service.deletePlayer).toHaveBeenCalledTimes(1);
    expect(service.deletePlayer).toHaveBeenCalledWith(7);
    expect(component.loadPlayers).toHaveBeenCalledTimes(1);
  });

  it('deletePlayer: si confirm=false NO debe llamar deletePlayer', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(service, 'deletePlayer');

    component.deletePlayer(7);

    expect(window.confirm).toHaveBeenCalledWith('¿Eliminar jugador?');
    expect(service.deletePlayer).not.toHaveBeenCalled();
  });
});
