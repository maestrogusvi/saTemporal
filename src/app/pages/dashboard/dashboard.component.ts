import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../shared/utils.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'sapper-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  showDashboard = true;
  public tableData = [{
    name: 'Salesforce to Zoho',
    description: 'Send a Direct Message in Zoho on a New Contact in Salesforce',
    applicationUsed: ['Salesforce', 'Zoho'],
    sourceApplications: [{name: 'Salesforce', logo: 'assets/images/sfdc.jpg'}],
    targetApplications: [{name: 'Zoho', logo: 'assets/images/zoho.jpg'}, {name: 'Outlook', logo: 'assets/images/logo.png'}]
  },
  {
    name: 'Gmail and Trello Integration',
    description: 'Send an email in Gmail on a New Card in Trello',
    applicationUsed: ['Gmail', 'Shopify'],
    sourceApplications: [{name: 'Gmail', logo: 'assets/images/adp.jpg'}],
    targetApplications: [
      {name: 'Zoho', logo: 'assets/images/zoho.jpg'},
      {name: 'Outlook', logo: 'assets/images/adobe.png'},
      {name: 'Shopify', logo: 'assets/images/shopify.jpg'}]
  },
  {
    name: 'Salesforce and Shopify Integration',
    description: 'Add or Update Customer in Shopify on a New Lead in Salesforce',
    applicationUsed: ['Salesforce', 'Shopify'],
    sourceApplications: [{name: 'Salesforce', logo: 'assets/images/sfdc.jpg'}],
    targetApplications: [{name: 'Shopify', logo: 'assets/images/shopify.jpg'}]
  },
];

  dashboardDetails;
  constructor(private readonly utilsService: UtilsService,
    public translate: TranslateService,
    private dashboardService: DashboardService) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
    this.getDashboardDetails();
   }

   getDashboardDetails() {
     this.dashboardService.getDashboardDetails().subscribe(data => {
        this.dashboardDetails = data.data;
     });
   }
}
