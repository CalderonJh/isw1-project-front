import { TestBed } from '@angular/core/testing';

import { StadiumsService } from '../service_app/stadiums.service';

describe('StadiumsService', () => {
  let service: StadiumsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StadiumsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
