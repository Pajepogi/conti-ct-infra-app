/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CloudStorageService } from './cloud-storage.service';

describe('Service: CloudStorage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CloudStorageService]
    });
  });

  it('should ...', inject([CloudStorageService], (service: CloudStorageService) => {
    expect(service).toBeTruthy();
  }));
});
