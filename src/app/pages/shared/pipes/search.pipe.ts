import { Pipe, PipeTransform } from '@angular/core';

/**
 * search pipe to filter application data in marketplace component
 */
@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(applications: any[], searchText: string): any[] {
    // if searchText not provided return all applications
    if (!searchText) {
      return applications;
    }
    // convert searchText to lowercase to match applications
    searchText = searchText.toLowerCase();
    // return applications that matches searchText
    return applications.filter(app => {
      return app.name.toLowerCase().includes(searchText);
    });
  }

}
