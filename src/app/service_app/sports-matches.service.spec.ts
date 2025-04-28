import { TestBed } from '@angular/core/testing';

import { SportsMatchesService } from '../service_app/sports-matches.service';

describe('SportsMatchesService', () => {
  let service: SportsMatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SportsMatchesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
