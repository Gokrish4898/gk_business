import { TestBed } from '@angular/core/testing';

import { maintenanceService } from './maintenance-service';

describe('maintenanceService', () => {
  let service: maintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(maintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
