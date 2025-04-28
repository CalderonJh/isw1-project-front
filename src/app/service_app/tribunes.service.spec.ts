import { TestBed } from '@angular/core/testing';

import { TribunesService } from '../service_app/tribunes.service';

describe('TribunesService', () => {
  let service: TribunesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TribunesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
