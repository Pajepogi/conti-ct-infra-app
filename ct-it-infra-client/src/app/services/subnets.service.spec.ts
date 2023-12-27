import { TestBed } from '@angular/core/testing';

import { SubnetsService } from './subnets.service';

describe('SubnetsService', () => {
  let service: SubnetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubnetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
