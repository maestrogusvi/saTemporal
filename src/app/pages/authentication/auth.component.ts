import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { ISlide } from './login/login.interface';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
  selector: 'sapper-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  @ViewChild(CarouselComponent) carousel: CarouselComponent;

  public rightPanel: boolean;
  public testimonials: ISlide[] = [
    {
      imageUrl: 'assets/images/Applications/jira.png',
      title: 'JIRA',
      from: 'John',
      position: 'Chief Technology Officer (JIRA)',
      content: 'Sapper allows us to integrate a myriad of technologies' +
      ' with the Atlassian suite, but more importantly, it enables us to' +
      ' design and implement elegant process orchestration solutions. ' +
      'This helps our clients achieve superior levels of performance and ' +
      'productivity by accelerating their technology and business processes.'
    },
    {
      imageUrl: 'assets/images/sfdc.jpg',
      title: 'SFDC',
      from: 'Anna Aston',
      position: 'Solutions Architect - IT Business Application (Salesforce)',
      content: 'Sapper workflow is a powerful platform to deploy then modify ' +
      'and expand over time. You can start with one kind of data set and, as other ' +
      'tools become relevant, you can just modify the flows to connect further upstream or downstream.'
    }
  ];
  constructor(
    public router: Router,
    public translate: TranslateService,
    private location: Location
  ) {
    const url = this.router.url;
    this.rightPanel = url.toLowerCase() !== '/login';
  }


  /**
   * To set animation type: (required to add animation)
   */
  setAnimationType(): void {
    setTimeout(() => {
      this.carousel.onNextClick();
    });
    setTimeout(() => {
      this.setAnimationType();
    }, 5000);
  }

  /**
   * Used to set rightPanel property value and change the route depends on which page is showing
   * @param  url: string
   * @returns void
   */

  gotoUrl(url: string): void {
    this.rightPanel = !this.rightPanel;
    this.location.go(url);
  }
}
