import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'sapper-sftp',
  templateUrl: './sftp.component.html',
  styleUrls: ['./sftp.component.scss']
})
export class SftpComponent implements OnInit {
  @Input() connectionData;
  constructor() {
    this.sftpConnectionType = [{
        label: 'Basic',
        value: 'BASIC'
      }, {
        label: 'Key File',
        value: 'KEYFILE'
      }
    ];
  }
  ngOnInit(): void {
    // to set BASIC as a default connection type
    this.connectionData.sftpConnectionType = this.connectionData.sftpConnectionType? this.connectionData.sftpConnectionType: 'BASIC';
  }

}
