import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddEditConnectionComponent } from 'src/app/pages/connections/add-edit-connection/add-edit-connection.component';
import { MatDialog } from '@angular/material/dialog';

import { Connection } from 'jsplumb';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'sapper-custom',
  templateUrl: './custom-header-field.html',
  styleUrls: ['./custom-header-field.scss']
})

export class CustomHeaderComponent implements OnInit {
  @Input() connectionData;
  public customHeaderList = [{ namespaceURI: '', localName: '', message: '' }];

  constructor(
    public dialogRef: MatDialogRef<AddEditConnectionComponent>,
    @Inject(MAT_DIALOG_DATA) data, ) {
    this.customHeaderList = this.customHeaderList === undefined || data.length === 0 ?
      [{ namespaceURI: '', localName: '', message: '' }] : data;

  }
  ngOnInit(): void {
  }

  addField(type): void {
    if (type === 'customerHeader') {


      this.customHeaderList.push({ namespaceURI: '', localName: '', message: '', });
    }
  }
  onDeleteRow(divId, rowId, key, type) {
    const element = document.getElementById(divId);
    element.remove();
    if (type === 'customerHeader') {
      this.customHeaderList.splice(rowId, 1);
    }
  }

  saveConnection(): void {
    this.dialogRef.close(this.customHeaderList);
  }
}

