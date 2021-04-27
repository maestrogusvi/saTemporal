import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'sapper-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  @Input() acceptedFiles: any;
  @Output() selectedMetaSource = new EventEmitter<any>();

  files: Array<File> = [];

  uploadFile(event) {
    this.selectedMetaSource.emit(event);
  }
}
