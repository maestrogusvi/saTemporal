import { TestBed } from '@angular/core/testing';

import { SqlClientService } from './sql-client.service';

describe('SqlClientService', () => {
  let service: SqlClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
