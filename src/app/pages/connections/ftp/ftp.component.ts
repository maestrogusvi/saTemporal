import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sapper-ftp',
  templateUrl: './ftp.component.html',
  styleUrls: ['./ftp.component.scss']
})
export class FtpComponent implements OnInit {

  @Input() connectionData;

  constructor() { }

  ngOnInit(): void {
  }

}
