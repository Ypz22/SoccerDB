import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { SoccerService } from './services/services';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

class SoccerServiceMock {
  login() {
    return of(true);
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        RouterTestingModule
      ],
      providers: [
        { provide: SoccerService, useClass: SoccerServiceMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent)
      .toContain('© 2025 Soccer DB | All rights reserved');
  });
});
