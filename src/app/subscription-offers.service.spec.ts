import { TestBed } from '@angular/core/testing';

import { SubscriptionOffersService } from './subscription-offers.service';

describe('SubscriptionOffersService', () => {
  let service: SubscriptionOffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionOffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
