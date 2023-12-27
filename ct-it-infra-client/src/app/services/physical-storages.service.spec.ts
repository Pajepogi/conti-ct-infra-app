import { TestBed } from '@angular/core/testing';

import { PhysicalStoragesService } from './physical-storages.service';

describe('PhysicalStoragesService', () => {
  let service: PhysicalStoragesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalStoragesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
