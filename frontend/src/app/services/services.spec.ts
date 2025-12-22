import { TestBed } from '@angular/core/testing';
import { SoccerService } from './services';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SoccerService', () => {
  let service: SoccerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SoccerService]
    });

    service = TestBed.inject(SoccerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
