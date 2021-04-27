import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import defaultLanguage from './../assets/i18n/en.json';

@Component({
  selector: 'sapper-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(public translate: TranslateService) {

    // use envirnment variable to access dev/stage api

    translate.addLangs(['en', 'fr']);
    translate.setTranslation('en', defaultLanguage);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    const language = browserLang.match(/en|fr/) ? browserLang : 'en';
    translate.use(language);
  }
}
