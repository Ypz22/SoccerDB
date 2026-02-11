import { TestBed, ComponentFixture } from '@angular/core/testing';
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
  let fixture: ComponentFixture<TeamsComponent>;
  let component: TeamsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsComponent, CommonModule, FormsModule],
      providers: [{ provide: SoccerService, useClass: SoccerServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el título principal', () => {
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1.title');
    expect(h1.textContent).toContain('Gestión de Equipos');
  });

  it('debe mostrar el formulario de equipos', () => {
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('debe mostrar todos los inputs del formulario', () => {
    const inputs = fixture.nativeElement.querySelectorAll('input');
    expect(inputs.length).toBe(4);
  });

  it('debe mostrar el botón de agregar equipo', () => {
    const btn = fixture.nativeElement.querySelector('button.btn-add');
    expect(btn).toBeTruthy();
  });

  it('debe cargar y mostrar la lista inicial de equipos ecuatorianos', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('debe mostrar los encabezados correctos de la tabla', () => {
    fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.css('table th'));
    const texts = headers.map(h => h.nativeElement.textContent.trim());
    expect(texts).toEqual(['ID', 'Nombre', 'Ciudad', 'Estadio', 'Año', 'Acciones']);
  });

  it('debe actualizar el modelo newTeam.name', () => {
    component.newTeam.name = 'Emelec';
    fixture.detectChanges();
    expect(component.newTeam.name).toBe('Emelec');
  });

  it('debe llamar a saveTeam al enviar el formulario', () => {
    spyOn(component, 'saveTeam');
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    expect(component.saveTeam).toHaveBeenCalled();
  });

  it('debe mostrar un icono de eliminar por cada equipo', () => {
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.fa-trash');
    expect(icons.length).toBe(2);
  });

  // =========================================================
  // ✅ PRUEBAS AGREGADAS (ngOnInit / loadTeams / saveTeam / deleteTeam)
  // =========================================================

  it('ngOnInit debe llamar loadTeams()', () => {
    spyOn(component, 'loadTeams');
    component.ngOnInit();
    expect(component.loadTeams).toHaveBeenCalled();
  });

  it('loadTeams debe llamar getTeams y ordenar por id ascendente', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(service, 'getTeams').and.returnValue(of([{ id: 3 }, { id: 1 }, { id: 2 }] as any[]));

    component.loadTeams();

    expect(service.getTeams).toHaveBeenCalledTimes(1);
    expect(component.teams.map(t => t.id)).toEqual([1, 2, 3]);
  });

  it('saveTeam debe llamar addTeam(newTeam), luego loadTeams y resetear newTeam', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(service, 'addTeam').and.returnValue(of({}));
    spyOn(component, 'loadTeams').and.callThrough();

    const expectedPayload = {
      name: 'Barcelona SC',
      city: 'Guayaquil',
      stadium: 'Monumental',
      year_foundation: 1925,
    };

    component.newTeam = { ...expectedPayload } as any;

    component.saveTeam();

    expect(service.addTeam).toHaveBeenCalledTimes(1);

    const calledWith = (service.addTeam as jasmine.Spy).calls.argsFor(0)[0];
    expect(calledWith).toEqual(expectedPayload);

    expect(component.loadTeams).toHaveBeenCalledTimes(1);

    expect(component.newTeam).toEqual({
      name: '',
      city: '',
      stadium: '',
      year_foundation: null,
    });
  });

  it('deleteTeam: si confirm=true debe llamar deleteTeam(id) y luego loadTeams', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(service, 'deleteTeam').and.returnValue(of({}));
    spyOn(component, 'loadTeams').and.callThrough();

    component.deleteTeam(7);

    expect(window.confirm).toHaveBeenCalledWith('¿Eliminar equipo?');
    expect(service.deleteTeam).toHaveBeenCalledTimes(1);
    expect(service.deleteTeam).toHaveBeenCalledWith(7);
    expect(component.loadTeams).toHaveBeenCalledTimes(1);
  });

  it('deleteTeam: si confirm=false NO debe llamar deleteTeam', () => {
    const service = TestBed.inject(SoccerService);

    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(service, 'deleteTeam');

    component.deleteTeam(7);

    expect(window.confirm).toHaveBeenCalledWith('¿Eliminar equipo?');
    expect(service.deleteTeam).not.toHaveBeenCalled();
  });
});
