import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UtilsService } from '../../shared/utils.service';

@Injectable({
  providedIn: 'root'
})

export class SignupService {
  private baseUrl = 'rest/api/';

  constructor(public router: Router, private utilsService: UtilsService) { }

  /**
   * user authentication
   * @param any  signupObject
   */
  signup(signupObject) {
    return this.utilsService.returnPostCall(`/user/register`, signupObject);
  }

}
