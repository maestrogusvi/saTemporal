import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { KeyPropertiesService } from './key-properties.service';
import { UtilsService } from './../../utils.service';

import { Observable } from 'rxjs';

@Component({
  selector: 'sapper-key-properties',
  templateUrl: './key-properties.component.html',
  styleUrls: ['./key-properties.component.scss']
})
export class KeyPropertiesComponent implements OnInit {

  displayedColumns: string[] = ['key', 'value'];
  data = [
    { key: '', value: '' }
  ];
  @Input() tasktype;
  @Input() set properties(properties) {
    if (properties) {
      this.getAdditionalProperties(this.tasktype);
      this.data.shift();
      this.data = [...this.data];
      Object.keys(properties).forEach(prop => {
        this.additionalProperties[prop] = properties[prop];
        if ((properties[prop] + '') === 'true' || (properties[prop] + '') === 'false') {
          properties[prop] = (properties[prop] + '').toUpperCase();
        }
        this.data.push({
          key: prop,
          value: properties[prop]
        });
      });
      this.data.push({ key: '', value: '' });
    } else {
      this.additionalProperties = {};
    }
  }

  control = new FormControl();
  additionalPropertiesOptions;
  additionalProperties = {};

  filteredAdditionalPropertiesOptions: Observable<any>;

  constructor(private keyPropertiesService: KeyPropertiesService,
    private utilsService: UtilsService) {
  }

  ngOnInit(): void {
    if (this.tasktype !== null) {
      this.getAdditionalProperties(this.tasktype);
    }
  }

  onChangeofFocus(event) {
    this.filteredAdditionalPropertiesOptions = this._filter(event.target.value);
  }

  getAdditionalProperties(taskType) {
    this.keyPropertiesService.getAdditionalProperties(taskType).subscribe(data => {
      this.additionalPropertiesOptions = data.data;
    });
  }

  private _filter(value: string) {
    const filterValue = this._normalizeValue(value);
    return this.additionalPropertiesOptions.fields.filter(prop => this._normalizeValue(prop.uiLabel).includes(filterValue));
  }

  private _normalizeValue(value: any): string {
    if (value) {
      return value.toLowerCase().replace(/\s/g, '');
    }
  }

  onBlurAdditionalPropertiesKey(control, row) {
    row.key = control.value;
  }

  onFocusAdditionalPropertiesKey(index) {
    if (this.data.length - 1 === index) {
      this.data.push({ key: '', value: '' });
    }
    this.data = [...this.data];
  }

  onBlurAdditionalPropertiesValue(selectedValue, row) {
    row.value = selectedValue;
    if (selectedValue.toUpperCase() === 'TRUE') {
      selectedValue = true;
    } else if (selectedValue.toUpperCase() === 'FALSE') {
      selectedValue = false;
    }
    this.additionalProperties[row.key] = selectedValue;
  }

  selectedAddPropertiesValueType(element) {
    if (this.additionalPropertiesOptions && this.additionalPropertiesOptions.fields) {
      const foundKey = this.additionalPropertiesOptions.fields.find(prop => {
        return prop.uiLabel === element.key;
      });
      return foundKey ? foundKey.fieldValue.fieldValueType.toLowerCase() : null;
    }
  }

  additionalPropertiesKeyAutoSelect(selectedValue, row) {
    row.key = selectedValue;
  }

  getOptions(element) {
    const foundKey = this.additionalPropertiesOptions.fields.find(prop => {
      return prop.uiLabel === element.key;
    });
    return foundKey ? foundKey.fieldValue.possibleValues : [];
  }
}
