import { TestBed } from '@angular/core/testing';

import { OcaTrackingService } from './oca-tracking.service';

describe('OcaTrackingService', () => {
  let service: OcaTrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OcaTrackingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
