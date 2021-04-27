import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { TpSourceService } from './tp-source.service';
import { MaterialModule } from '../../../shared/modules/material.module';

describe('TpSourceService', () => {
  let service: TpSourceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ]
    });
    service = TestBed.inject(TpSourceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should get ftp file list', () => {
    const connectionId = '12345';
    const directoryPath = '/abc';
    const dummyResponse = {
      data: ['file-1', 'file-2']
    };
    service.getFtpFileList(connectionId, directoryPath).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `/ftp-properties/files?connectionId=${connectionId}&directoryPath=${directoryPath}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('Should get s3 file list', () => {
    const connectionId = '12345';
    const directoryPath = '/abc';
    const dummyResponse = {
      data: ['file-1', 'file-2']
    };
    service.getS3FileList(connectionId, directoryPath).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `/s3-properties/files?connectionId=${connectionId}&directoryPath=${directoryPath}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

  it('Should get sftp file list', () => {
    const connectionId = '12345';
    const directoryPath = '/abc';
    const dummyResponse = {
      data: ['file-1', 'file-2']
    };
    service.getSftpFileList(connectionId, directoryPath).subscribe((data) => {
      expect(data).toEqual(dummyResponse);
    });

    const req = httpTestingController.expectOne(
      `/sftp-properties/files?connectionId=${connectionId}&directoryPath=${directoryPath}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
    httpTestingController.verify();
  });

});
