import { Component, Input } from '@angular/core';

@Component({
  selector: 'sapper-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss']
})
export class ApplicationCardComponent {
  @Input() applicationsList;
  @Input() applicationFlexOptions;
  constructor() { }
}
