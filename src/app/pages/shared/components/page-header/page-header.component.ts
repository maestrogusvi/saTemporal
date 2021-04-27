import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sapper-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  @Input() title;
  @Input() description;
  @Input() button;

  constructor() { }

  ngOnInit(): void {
  }

}
