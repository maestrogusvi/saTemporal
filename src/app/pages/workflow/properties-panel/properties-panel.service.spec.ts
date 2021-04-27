import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { PropertiesPanelService } from './properties-panel.service';
import { MaterialModule } from '../../shared/modules/material.module';

describe('PropertiesPanelService', () => {
  let service: PropertiesPanelService;
  let properties;
  let httpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PropertiesPanelService);
    properties = {
      name: 'Workflow name',
      description: 'Description',
      propertiesType: 'TP_SOURCE',
      taskProperties: {
        directoryPath: '/abc.xml',
        encoding: 'UTF-8',
        backupRemoteFile: false,
        deleteRemoteFile: false,
        isRemoteFileEncrypted: false,
        decryptionKey: 'abc',
        regularExpression: 'ab*',
        files:  ['file1']
      }
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should call save properties function', () => {
    service.saveTaskProperties(properties).subscribe((data) => {
      expect(data.name).toEqual('Workflow name');
    });

    const req = httpTestingController.expectOne(
      '/task-properties'
    );
    expect(req.request.method).toBe('POST');
    req.flush();
    httpTestingController.verify();
  });
});
