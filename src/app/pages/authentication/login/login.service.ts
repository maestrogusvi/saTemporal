import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { IUserData } from './login.interface';
import { UtilsService } from '../../shared/utils.service';
import {API} from '../../../constants/api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public router: Router, private utilsService: UtilsService) { }

  /**
   * user authentication
   * @param userObject : IUserData
   * @returns any
   */
  login(userObject: IUserData): any {
    return this.utilsService.returnPostCall(API.SERVER + API.API + API.LOGIN, userObject);
  }

}
