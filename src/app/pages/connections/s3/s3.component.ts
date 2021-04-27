import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sapper-s3',
  templateUrl: './s3.component.html'
})
export class S3Component implements OnInit {

  @Input() connectionData;

  constructor() { }

  ngOnInit(): void {
  }

}
