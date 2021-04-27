import { TestBed } from '@angular/core/testing';

import { CloneAutomationService } from './clone-automation.service';

describe('CloneAutomationService', () => {
  let service: CloneAutomationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloneAutomationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
