import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { TpSourceComponent } from './tp-source.component';
import { MaterialModule } from '../../../shared/modules/material.module';
import { of } from 'rxjs';
import { TpSourceService } from './tp-source.service';

describe('TpSourceComponent', () => {
  let component: TpSourceComponent;
  let fixture: ComponentFixture<TpSourceComponent>;
  let tpSourceService: TpSourceService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TpSourceComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MaterialModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TpSourceComponent);
    component = fixture.componentInstance;
    tpSourceService = TestBed.inject(TpSourceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set file read option for s3source', () => {
    const event = {
      value: {
        value: 'fileName'
      }
    };
    const droppedNode = {
      taskType: 's3Source'
    };
    const fileData = ['file-1'];
    spyOn(tpSourceService, 'getS3FileList').and.returnValue(of(fileData));
    component.setFileReadOptions(event, droppedNode);
  });

  it('should set file read option for ftpSource', () => {
    const event = {
      value: {
        value: 'fileName'
      }
    };
    const droppedNode = {
      taskType: 'ftpSource'
    };

    const fileData = ['file-1'];
    spyOn(tpSourceService, 'getFtpFileList').and.returnValue(of(fileData));
    component.setFileReadOptions(event, droppedNode);
  });

  it('should set file read option for sftpSource', () => {
    const event = {
      value: {
        value: 'fileName'
      }
    };
    const droppedNode = {
      taskType: 'sftpSource'
    };

    const fileData = ['file-1'];
    spyOn(tpSourceService, 'getSftpFileList').and.returnValue(of(fileData));
    component.setFileReadOptions(event, droppedNode);
  });

  it('should set file read option if there is no type', () => {
    const event = {
      value: {
        value: 'fileName'
      }
    };
    const droppedNode = {
      taskType: ''
    };
    component.setFileReadOptions(event, droppedNode);
  });

  it('if filename is not selected then', () => {
    const event = {
      value: {
        value: ''
      }
    };
    const droppedNode = {
      taskType: ''
    };
    component.setFileReadOptions(event, droppedNode);
  });

});
