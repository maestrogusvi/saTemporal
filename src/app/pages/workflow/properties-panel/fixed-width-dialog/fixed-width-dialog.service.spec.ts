import { TestBed } from '@angular/core/testing';

import { FixedWidthDialogService } from './fixed-width-dialog.service';

describe('FixedWidthDialogService', () => {
  let service: FixedWidthDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedWidthDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
