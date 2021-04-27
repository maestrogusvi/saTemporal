import { Component, Input } from '@angular/core';

@Component({
  selector: 'sapper-application-used',
  templateUrl: './application-used.component.html',
  styleUrls: ['./application-used.component.scss']
})
export class ApplicationUsedComponent {
  @Input() sourceApplications;
  @Input() targetApplications;
}
