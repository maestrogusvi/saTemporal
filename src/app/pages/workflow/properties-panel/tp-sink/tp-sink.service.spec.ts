import { TestBed } from '@angular/core/testing';

import { TpSinkService } from './tp-sink.service';

describe('TpSinkService', () => {
  let service: TpSinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TpSinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
