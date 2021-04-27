import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileComponent } from './upload-file.component';

describe('PageHeaderComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit upload file event', () => {
    const event = {
      target: {
        files: [{
          lastModified: 1555348814186,
          lastModifiedDate: "Mon Apr 15 2019 22:50:14 GMT+0530 (India Standard Time)",
          name: "sample.json",
          size: 553,
          type: "application/json",
          webkitRelativePath: ""
        }]
      }
    };
    spyOn(component.selectedMetaSource, 'emit');
    component.uploadFile(event);
    expect(component.selectedMetaSource.emit).toHaveBeenCalled();
  })
});
