import { TestBed } from '@angular/core/testing';

import { KeyPropertiesService } from './key-properties.service';

describe('KeyPropertiesService', () => {
  let service: KeyPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
