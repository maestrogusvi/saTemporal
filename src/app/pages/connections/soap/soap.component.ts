import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ConnectionService } from './../connection.service';
import { UtilsService } from '../../shared/utils.service';

@Component({
  selector: 'sapper-soap',
  templateUrl: './soap.component.html',
  styleUrls: ['./soap.component.scss']
})
export class SoapComponent implements OnInit {
  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  myfilename = 'Select File';
  file: File;
  CONNECTION: true;
  connectionDataProperties: any;

  @Input() set connectionData(connectionData) {
    if (connectionData) {
      this.connectionDataProperties = connectionData;
      this.getFileName(this.connectionDataProperties.fileId);
    }
  }
  constructor(
    private connectionService: ConnectionService,
    private utilsService: UtilsService,
  ) { }

  passwordType = [{
    key: 'PASSWORD TEXT',
    value: 'PasswordText'
  },
  {
    key: 'PASSWORD DIGEST',
    value: 'PasswordDigest'
  },
  {
    key: 'X509_CERTIFICATE',
    value: 'X509_Certificate'
  }];

  ngOnInit(): void {
  }

  fileUploadSoap(fileId): void {
    const formData = new FormData();
    formData.append('file', this.file);
    if (fileId) {
      this.onEditFileUpload(fileId, formData);
    } else {
      this.connectionService.fileUploadSoap(formData).subscribe(data => {
        if (this.connectionDataProperties) {
          this.utilsService.showSuccess('File uploaded successfully...', '');
          this.connectionDataProperties.fileId = data.data;
        }
      });
    }
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
      this.myfilename = this.file.name;
    } else {
      this.myfilename = 'Select File';
    }
  }

  onEditFileUpload(fileId, formData): void {
    this.connectionService.onEditFileUpload(fileId, formData).subscribe(data => {
      if (data.data) {
        this.utilsService.showSuccess('File uploaded successfully...', '');
        this.connectionDataProperties.fileId = data.data;
      }
    });
  }

  getFileName(fileId) {
    if (!fileId) {
      return;
    }

    this.connectionService.getFile(fileId).subscribe(data => {
      if (data.data) {
        this.myfilename = data.data.fileName;
      }
    });
  }
}
