import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('debe mostrar la sección hero', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const hero = fixture.nativeElement.querySelector('section.hero');
    expect(hero).toBeTruthy();
  });

  it('debe mostrar el título principal', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1.big-title');
    expect(h1.textContent).toContain('SOCCER');
    expect(h1.textContent).toContain('LANDING PAGE');
  });

  it('debe mostrar el subtítulo descriptivo', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const p = fixture.nativeElement.querySelector('p.subtitle');
    expect(p.textContent).toContain('Administra tus equipos');
  });

  it('debe mostrar el botón Learn More', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const btn = fixture.nativeElement.querySelector('button.cta');
    expect(btn.textContent.trim()).toBe('LEARN MORE');
  });

  it('el botón debe tener routerLink a /players', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const btn = fixture.debugElement.query(By.css('button.cta'));
    expect(btn.attributes['routerLink']).toBe('/players');
  });

  it('debe mostrar la imagen del jugador', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
  });

  it('la imagen debe tener src y alt correctos', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const img = fixture.nativeElement.querySelector('img');
    expect(img.src).toContain('assets/jugador.jpeg');
    expect(img.alt).toBe('Soccer Player');
  });

});
