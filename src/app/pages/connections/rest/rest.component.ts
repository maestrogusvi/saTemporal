import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sapper-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.scss']
})
export class RestComponent implements OnInit {

  @Input() connectionData;
  authType = [
    {
      key: 'REST_BASIC',
      value: 'Basic'
    },
    {
      key: 'REST_API_KEY',
      value: 'API Key'
    },
    {
      key: 'REST_TOKEN',
      value: 'Bearer'
    },
    {
      key: 'REST_OAUTH2',
      value: 'OAuth'
    }
  ];
  httpMethod = ['GET', 'POST'];
  contentType = ['JSON'];
  // headerPrefix = ['Basic', 'Bearer', 'Token', 'None'];
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

  public headerArr = [];
  public queryParam = [];
  parameterType = [
    { key: 'Header Parameter', value: 'HEADER' },
    { key: 'Query Parameter', value: 'QUERY_PARAM' }
  ];

  constructor() { }

  ngOnInit(): void {
    if (this.connectionData) {
      if (this.connectionData.type === 'REST_TOKEN') {
        this.setFieldAttributes(this.connectionData.connectionProperties.httpHeaders, 'headers');
        this.setFieldAttributes(this.connectionData.connectionProperties.queryParams, 'queryParam');
      } else if (this.connectionData.type === 'REST_API_KEY') {
        this.setFieldAttributes(this.connectionData.connectionProperties.connectionQueryParameters, 'queryParam');
      } else if (this.connectionData.type === 'REST_BASIC') {
        this.setFieldAttributes(this.connectionData.connectionProperties.httpHeaders, 'headers');
        this.setFieldAttributes(this.connectionData.connectionProperties.queryParams, 'queryParam');
      }
    }
    if (!this.connectionData.connectionProperties.httpHeaders ||
      !Object.keys(this.connectionData.connectionProperties.httpHeaders).length) {
      this.headerArr = [{ headerKey: '', headerValue: '' }];
    }
    if (!this.connectionData.connectionProperties.queryParams ||
      !Object.keys(this.connectionData.connectionProperties.queryParams).length) {
      this.queryParam = [{ headerKey: '', headerValue: '' }];
    }
  }

  addField(type) {
    if (type === 'queryParam') {
      this.queryParam.push({ headerKey: '', headerValue: '' });
    } else {
      this.headerArr.push({ headerKey: '', headerValue: '' });
    }
  }

  private setFieldAttributes(element, type) {
    for (const key in element) {
      if (element.hasOwnProperty(key)) {
        const value = element[key];
        if (type === 'headers') {
          this.headerArr.push({ headerKey: key, headerValue: value });
        } else if (type === 'queryParam') {
          this.queryParam.push({ headerKey: key, headerValue: value });
        }
      }
    }
  }

  onDeleteRow(divId, rowId, key, type) {
    const element = document.getElementById(divId);
    element.remove();
    if (type === 'headers') {
      this.headerArr.splice(rowId, 1);
      delete this.connectionData.connectionProperties.httpHeaders[key];
    } else {
      this.queryParam.splice(rowId, 1);
      delete this.connectionData.connectionProperties.queryParams[key];
    }
  }

}
