import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { UtilsService } from '../shared/utils.service';
import { IApplicationNode } from './app-store.interface';
import { AppStoreService } from './app-store.service';

@Component({
  selector: 'sapper-marketplace',
  templateUrl: './app-store.component.html',
  styleUrls: ['./app-store.component.scss']
})
export class AppStoreComponent implements OnInit {

  /**
   * All applications data
   */
  applicationList: IApplicationNode[];
  appDataCopy;
  searchText;
  selectedApp = [];
  isDomainFilter = false;
  domainVal = [];
  domainList = [
    'HRMS', 'CRM', 'LMS', 'HCM', 'Benefits', 'Time Management', 'Payroll',
    'Content', 'Productivity', 'E-Commerce', 'Data Warehouse', 'Social Network',
    'SSO', 'Certification', 'Micro Content', 'Analytics', 'Ticketing Systems',
    'Gamification', 'Recruiting Systems', 'Media Service Provider', 'Collaboration Portal',
    'Communication'];
  domainSelected = [];
  searchDomain = '';
  searchApp = '';

  constructor(
    public translate: TranslateService,
    public utilsService: UtilsService,
    public router: Router,
    private appStoreService: AppStoreService) {
    translate.addLangs(utilsService.getLangList());
    translate.use(utilsService.getDefaultLang());
  }

  ngOnInit() {
    this.getAllApplications();
  }

  /**
   *
   * @param domainName > 25 characters then show ellipse
   */
  getDomainName(domainName) {
    if (domainName.length > 25) {
      return `${domainName.substring(0, 25)}...`;
    }
    return domainName;
  }

  /**
   *
   * @param domainName > 25 show material tooltip
   */
  isTooltipEnabled(domainName) {
    if (domainName.length > 25) {
      return false;
    }
    return true;
  }

  redirect() {
    const apps = this.selectedApp.join(',');
    this.router.navigateByUrl(`/community-workflow?apps=${apps}`);
  }
  /**
   *
   * @param appName Filter workflows according to selection of an application
   */
  selectApplication(app): void {
    if (!this.selectedApp.includes(app.name)) {
      this.selectedApp.push(app.name);
    }
  }

  removeApp(appName): void {
    const index = this.selectedApp.indexOf(appName);
    if (index > -1) {
      this.selectedApp.splice(index, 1);
    }
  }

  selectDomain(event, data: string, index: number): void {
    const toPosition = event.checked ? 0 : this.domainList.length - 1;
    this.domainList = this.moveElemArray(this.domainList, index, toPosition);
    if (toPosition === 0) {
      this.domainSelected.push(data);
    } else {
      const poss = this.domainSelected.indexOf(data);
      this.domainSelected.splice(poss, 1);
    }
    this.filetrByDomain();
  }

  private moveElemArray(array, from, to) {
    return array.map((item, i) =>
      i === to ? array[from] : (i >= Math.min(from, to) && i <= Math.max(from, to) ? array[i + Math.sign(to - from)] : item)
    );
  }

  /**
   * clear search text of applications
   */
  clearSearchText(): void {
    this.searchText = '';
  }

  /**
   * Filter data according to application domain
   */
  private filetrByDomain(): void {
    const applications = this.appDataCopy;
    if (this.domainSelected.length > 0) {
      this.applicationList = applications.filter(obj =>
        obj.categories.some((domain) => this.domainSelected.indexOf(domain) > -1)
      );
    } else {
      this.applicationList = applications;
    }
  }

  /**
   * To get all applications
   * @returns void
   */
  private getAllApplications(): void {
    this.appStoreService.getAllApplications().subscribe(data => {
      this.applicationList = data.data;
      // created copy of all applications
      this.appDataCopy = this.applicationList;
    });
  }
}
