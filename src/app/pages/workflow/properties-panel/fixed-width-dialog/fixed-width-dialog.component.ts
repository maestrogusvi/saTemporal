import { Component, OnInit, Inject } from '@angular/core';
import { FixedWidthDialogService } from './fixed-width-dialog.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'sapper-fixed-width-dialog',
  templateUrl: './fixed-width-dialog.component.html',
  styleUrls: ['./fixed-width-dialog.component.scss'],
})
export class FixedWidthDialogComponent implements OnInit {
  panelOpenState;
  fixedWidthMetaList = [
    {
      name: '',
      startIndex: 0,
      charLength: 3,
      type: 'string',
    },
  ];

  dataTypes = [
    {
      label: 'String',
      value: 'string',
    },
    {
      label: 'Number',
      value: 'number',
    },
    {
      label: 'Boolean',
      value: 'boolean',
    },
  ];
  fixedWidthMeta;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<FixedWidthDialogComponent>,
    @Inject(MAT_DIALOG_DATA) dialogData,
    private fixedWidthDialogService: FixedWidthDialogService
  ) {
    if(dialogData) {
      this.fixedWidthMeta = dialogData;
      let responseMetaList =JSON.parse(dialogData.meta);
      this.fixedWidthMetaList = Object.values(responseMetaList.response.items.properties);
    }
  }

  ngOnInit(): void {

  }

  addNewField() {
    const fixedWidthMetaObject = {
      name: '',
      startIndex: 0,
      charLength: 0,
      type: 'string',
    };
    this.fixedWidthMetaList.push(fixedWidthMetaObject);
  }

  saveFixedWidthMeta() {
    if(this.fixedWidthMeta?.id) {
      this.fixedWidthDialogService.updateFixedWidthMeta(this.fixedWidthMetaList, this.fixedWidthMeta.id).subscribe(response => {
        this.dialogRef.close(response);
      });
    } else {
      this.fixedWidthDialogService.saveFixedWidthMeta(this.fixedWidthMetaList).subscribe(response => {
        this.dialogRef.close(response);
      });
    }
  }

  deleteField(index) {
    this.fixedWidthMetaList.splice(index,1);
  }
}
