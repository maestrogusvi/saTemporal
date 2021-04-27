import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sapper-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit {

  @Input() rightPanelData;
  objectList = [];

  constructor() { }

  ngOnInit(): void {
    if (this.rightPanelData && this.rightPanelData.properties) {
      this.rightPanelData.properties.connections = '';
      this.rightPanelData.properties.version = '';
      this.rightPanelData.properties.object = '';
      this.rightPanelData.properties.operation = '';
    }
  }

  onVersionChange(event) {
  }

  onObjectChange(eveny) { }

  onOperationChange(event) { }

  onConnectionChange(event) { }

}
