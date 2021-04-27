import { Component, Input, OnInit } from '@angular/core';
import { DbClient } from './db-client.enum';

@Component({
  selector: 'sapper-db-client',
  templateUrl: './db-client.component.html',
  styleUrls: ['./db-client.component.scss']
})
export class DbClientComponent implements OnInit {

  @Input() connectionData;
  databaseType = [{
    key: 'MySQL',
    value: 'MYSQL'
  }, {
    key: 'Oracle',
    value: 'ORACLE'
  }, {
    key: 'Snowflake',
    value: 'SNOWFLAKE'
  }];
  driverClass = DbClient;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeDbType(database): void {
    this.connectionData.driverClassName = this.driverClass[database.value];
  }

}
