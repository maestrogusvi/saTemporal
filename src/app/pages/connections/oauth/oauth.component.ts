import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sapper-oauth',
  templateUrl: './oauth.component.html'
})
export class OauthComponent implements OnInit {

  @Input() connectionData;
  grandType = [{
    key: 'Authorization Code',
    value: 'AUTHORIZATION_CODE'
  },
  {
    key: 'Password',
    value: 'PASSWORD'
  },
  {
    key: 'Client Credentials',
    value: 'CLIENT_CREDENTIALS'
  }];

  headerPrefix = [
    {
      key: 'Basic',
      value: 'Basic'
    },
    {
      key: 'Bearer',
      value: 'Bearer'
    },
    {
      key: 'Token',
      value: 'Token'
    },
    {
      key: 'None',
      value: ''
    }
  ];
  responseType = ['CODE', 'code', 'token'];

  constructor() { }

  ngOnInit(): void {
  }

}
