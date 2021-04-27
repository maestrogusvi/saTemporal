import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


import { TranslateService } from '@ngx-translate/core';
import { jsPlumb } from 'jsplumb';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SapperEnum } from '../../core/sapper-enum';
import { MetaJsonToTreeFormatPipe } from 'src/app/core/pipe/meta-json-to-tree-format.pipe';


@Injectable({
  providedIn: 'root'
})

export class UtilsService {
  jsonValue;
  private langList = ['en', 'fr'];
  private defaultLang = 'en';
  constructor(
    public translate: TranslateService,
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private snackBar: MatSnackBar
  ) {
    const browserLang = translate.getBrowserLang();
    this.defaultLang = browserLang.match(/en|fr/) ? browserLang : 'en';
  }

  /**
   * to get default language
   */
  getDefaultLang(): string {
    return this.defaultLang;
  }

  /**
   * to set language
   * @param lang : string
   */
  setDefaultLang(lang: string): void {
    this.defaultLang = lang;
  }

  /**
   * to get language list
   */
  getLangList(): string[] {
    return this.langList;
  }

  /**
   * for the get api call
   * @param api: string
   */
  returnGetCall(api): Observable<any> {
    return this.httpClient.get(api);
  }

  /**
   * for the post api call
   * @param api: string
   * @param data: any
   */
  returnPostCall(api, data): Observable<any> {
    return this.httpClient.post(api, data);
  }

  /**
   * for the put api call
   * @param api: string
   * @param data: any
   */
  returnPutCall(api, data): Observable<any> {
    return this.httpClient.put(api, data);
  }

  /**
   * for the delete api call
   * @param api: string
   */
  returnDeleteCall(api): Observable<any> {
    return this.httpClient.delete(api);
  }

  /**
   * to get the actual data from response
   * @param response: any
   */
  fetchResponseData(response): any {
    if (response) {
      if (response.data) {
        return response.data;
      }
      if (response.message) {
        return response.message;
      }
      if (response.status) {
        return response.status;
      }
      if (response.count) {
        return response.count;
      }
    }
    return false;
  }

  /**
   * return false if data is empty
   * @param data: any
   */
  checkIfDataExsists(data): any {
    if (data) {
      if (typeof (data) === 'object') {
        return Object.keys(data).length > 0;
      } else if (typeof (data) === 'boolean') {
        return data;
      } else {
        return data.toString().trim().length > 0;
      }
    }
    return false;
  }

  /**
   * to set item in session storage
   * @param dataLabel: string
   * @param data: any
   */
  setItemInSessionStorage(dataLabel, data): void {
    sessionStorage.setItem(dataLabel, data);
  }

  /**
   * to get item from session storage
   * @param dataLabel: string
   */
  getItemFromSessionStorage(dataLabel): any {
    return sessionStorage.getItem(dataLabel);
  }

  /**
   * to get content type
   * @param request: string
   */
  getContentType(request: string): string {
    if (request.includes('meta') || request.includes('multi-media')) {
      return null;
    }
    return 'application/json';
  }

  /**
   * to clear session storage
   */
  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  /**
   * To show success message
   * @param message: string
   * @param title: string
   */
  showSuccess(message, title) {
    this.toastr.success(message, title);
  }

  /**
   * To show error message
   * @param message: string
   * @param title: string
   */
  showError(message, title) {
    this.toastr.error(message, title);
  }

  /**
   * To show info message
   * @param message: string
   * @param title: string
   */
  showInfo(message, title) {
    this.toastr.info(message, title);
  }

  /**
   * To show warning message
   * @param message: string
   * @param title: string
   */
  showWarning(message, title) {
    this.toastr.warning(message, title);
  }

  /**
   * Used to find item index from json array
   * @param  array
   * @param  element
   * @param  field
   * @returns number
   */
  findElementInJsonArray(array, element, field): number {
    return array.findIndex((item => item[field] === element[field]));
  }

  /**
   * Used to convert date to show on UI in specific format
   * @param string date
   * @returns string
   */
  convertDateToShow(date): string {
    return (new Date(date)).toISOString();
  }


  /**
   * Used to open snacbar for showing error message
   * @param string message
   */
  openSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: SapperEnum.snac_horizontal_pos,
      verticalPosition: SapperEnum.snac_vertical_pos,
    });
  }

  /**
   * Transform metaFields data into treeview readable object
   * @param meta metaData
   * @returns mappingFields
   */
  updateTreeViewData(meta): any[] {
    const mappingFields = [];
    const metaCopy = meta;
    if (metaCopy) {
      // tslint:disable-next-line: forin
      for (const propertyKey in metaCopy) {
        mappingFields.push(new MetaJsonToTreeFormatPipe().transform(metaCopy[propertyKey], propertyKey));
      }
    }
    return mappingFields;
  }

  /**
   * Create drop event for data-slots
   * Helps to create UI on drop of data-slots
   * using json-path, step and taskid
   */
  dropEvent(dropEvent, editor) {
    const label = `${this.getData(dropEvent, 'json-step')}_${this.getData(dropEvent, 'json-path')}`;
    const taskId = this.getData(dropEvent, 'task-id');
    const jsonPath = this.getData(dropEvent, 'json-path');
    const slotType = this.getData(dropEvent, 'slot-type');
    editor.getEditor().html.insert(`</span><span class='tags small-text tag-editor fr-deletable' contenteditable='false' data-id='${taskId}' data-json-path='${jsonPath}' data-slot-type='${slotType}'>${label}</span><span>&nbsp;</span><span>`);
  }



  private getData(dropEvent, type) {
    return dropEvent.originalEvent.dataTransfer.getData(type);
  }

  convertSlotToTemp(content, flag?) {
    if (content && typeof content === 'string') {
      content = content.replace(/\<p>/g, '');
      content = content.replace(/\<\/p>/g, '');
      content = content.replace(/'/g, '\"');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const spanArr = tempDiv.getElementsByTagName('span');
      // const l = spanArr.length;
      for (let i = spanArr.length; i >= 0; i--) {
        if (spanArr[i] && spanArr[i].getAttribute('data-id')) {
          if (spanArr[i].getAttribute('data-slot-type') === 'subProcess' || flag) {
            let slot = `_SE_{_P('data.${spanArr[i].getAttribute('data-id')}`;
            if (spanArr[i].getAttribute('data-json-path')) {
              slot = slot + `.${spanArr[i].getAttribute('data-json-path')}`;
            }
            slot = slot + `')}`;
            spanArr[i].after(slot);
          } else {
            let slot = `_SE_{_P('data.${spanArr[i].getAttribute('data-id')}.response`;
            if (spanArr[i].getAttribute('data-json-path')) {
              slot = slot + `.${spanArr[i].getAttribute('data-json-path')}`;
            }
            slot = slot + `')}`;
            spanArr[i].after(slot);
          }
          spanArr[i].remove();
        }
      }
      content = tempDiv.innerHTML;
      tempDiv.remove();
      content = content.replace(/\<br>/g, '');
      content = content.replace(/&nbsp;/g, '');
      content = content.replace(/<\/?span[^>]*>/g, '');
      content = content.replace(/<\/?a[^>]*>/g, '');
      content = content.replace(/<\/?div[^>]*>/g, '');
      content = content.replace(/<span>&nbsp;<\/span>/g, '');
      content = content.replace(/\s\s+/g, ' ');
      content = content.replace(/response.response/g, 'response');
    }
    return content;
  }

  templateToSlot(content, dragDataObj) {
    if (content && typeof content === 'string') {
      content = content.replace(/_SE_{_P\('/g, `<span class='tags small-text tag-editor fr-deletable' contenteditable='false'>`);
      content = content.replace(/'\)}/g, '</span>');
      const tempPara = document.createElement('p');
      const jsPlumbInstance = jsPlumb.getInstance();
      tempPara.innerHTML = content;
      const spanArr = tempPara.getElementsByTagName('span');
      for (let i = 0; i < spanArr.length; i++) {
        const textArr = spanArr[i].innerHTML.split('.');
        if (dragDataObj[textArr[1]] && dragDataObj[textArr[1]].sapper_prop) {
          const label = dragDataObj[textArr[1]].sapper_prop.step + '_' + textArr[textArr.length - 1];
          spanArr[i].textContent = label;
          // spanArr[i].classList.add('tags', 'small-text', 'tag-editor');
          spanArr[i].setAttribute('data-id', textArr[1]);
          if (textArr[2] !== 'response' || textArr[textArr.length - 1] === 'response') {
            textArr.splice(0, 2);
            spanArr[i].setAttribute('data-json-path', textArr.join('.'));
            spanArr[i].setAttribute('data-slot-type', 'subProcess');
          } else {
            textArr.splice(0, 3);
            spanArr[i].setAttribute('data-json-path', textArr.join('.'));
          }
        } else if (jsPlumbInstance['getGroupFor'](textArr[1])) {
          const grp = dragDataObj[jsPlumbInstance['getGroupFor'](textArr[1]).id];
          if (grp.child && grp.child[textArr[1]] && grp.child[textArr[1]].sapper_prop) {
            const label = grp.child[textArr[1]].sapper_prop.step + '_' + textArr[textArr.length - 1];
            spanArr[i].textContent = label;
            // spanArr[i].classList.add('tags', 'small-text', 'tag-editor');
            spanArr[i].setAttribute('data-id', textArr[1]);
            if (textArr[2] !== 'response') {
              textArr.splice(0, 2);
              spanArr[i].setAttribute('data-json-path', textArr.join('.'));
              spanArr[i].setAttribute('data-slot-type', 'subProcess');
            } else {
              textArr.splice(0, 3);
              spanArr[i].setAttribute('data-json-path', textArr.join('.'));
            }
          }
        }
      }
      content = tempPara.innerHTML;
    }
    return content;
  }

  removeBrNbsp(content) {
    content = content.replace(/\<br>/g, '');
    content = content.replace(/&nbsp;/g, '');
    return content;
  }

  conditionalSlotToTemp(content) {
    if (content && typeof content === 'string') {
      content = content.replace(/\<p>/g, '');
      content = content.replace(/\<br>/g, '');
      content = content.replace(/\<\/p>/g, '');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const spanArr = tempDiv.getElementsByTagName('span');
      // const l = spanArr.length;
      for (let i = spanArr.length; i >= 0; i--) {
        if (spanArr[i] && spanArr[i].getAttribute('data-id') && spanArr[i].getAttribute('data-json-path')) {
          if (spanArr[i].getAttribute('data-slot-type') === 'subProcess') {
            let slot = `_P('data.${spanArr[i].getAttribute('data-id')}`;
            if (spanArr[i].getAttribute('data-json-path')) {
              slot = slot + `.${spanArr[i].getAttribute('data-json-path')}`;
            }
            slot = slot + `')`;
            spanArr[i].after(slot);
          } else {
            let slot = `_P('data.${spanArr[i].getAttribute('data-id')}.response`;
            if (spanArr[i].getAttribute('data-json-path')) {
              slot = slot + `.${spanArr[i].getAttribute('data-json-path')}`;
            }
            slot = slot + `')`;
            spanArr[i].after(slot);
          }
          spanArr[i].remove();
        }
      }
      content = tempDiv.innerHTML;
      tempDiv.remove();
      content = content.replace(/<span>&nbsp;<\/span>/g, '');
      content = content.replace(/&gt;/g, '>');
      content = content.replace(/&lt;/g, '<');
      content = content.replace(/&nbsp;/g, ' ');
      content = content.replace(/<\/?span[^>]*>/g, '');
      content = content.replace(/<\/?a[^>]*>/g, '');
      content = content.replace(/<\/?div[^>]*>/g, '');
      content = content.replace(/\s\s+/g, ' ');
      content = content.replace(/response.response/g, 'response');
    }
    content = '${runtimeBean.resolveExpression("_SE_{' + content + '}",execution)}';
    return content;
  }

  conditionalTempToSlot(content, dragDataObj) {
    if (content && typeof content === 'string') {
      content = content.replace(/_P\('/g, `<span class='tags small-text tag-editor fr-deletable' contenteditable='false'>`);
      content = content.replace(/'\)/g, '</span>');
      const tempPara = document.createElement('p');
      const jsPlumbInstance = jsPlumb.getInstance();
      tempPara.innerHTML = content;
      const spanArr = tempPara.getElementsByTagName('span');
      for (let i = 0; i < spanArr.length; i++) {
        const textArr = spanArr[i].innerHTML.split('.');
        if (dragDataObj[textArr[1]] && dragDataObj[textArr[1]].sapper_prop) {
          const label = dragDataObj[textArr[1]].sapper_prop.step + '_' + textArr[textArr.length - 1];
          spanArr[i].textContent = label;
          // spanArr[i].classList.add('tags', 'small-text', 'tag-editor');
          spanArr[i].setAttribute('data-id', textArr[1]);
          if (textArr[2] !== 'response') {
            textArr.splice(0, 2);
            spanArr[i].setAttribute('data-json-path', textArr.join('.'));
            spanArr[i].setAttribute('data-slot-type', 'subProcess');
          } else {
            textArr.splice(0, 3);
            spanArr[i].setAttribute('data-json-path', textArr.join('.'));
          }
        } else if (jsPlumbInstance['getGroupFor'](textArr[1])) {
          const grp = dragDataObj[jsPlumbInstance['getGroupFor'](textArr[1]).id];
          if (grp.child && grp.child[textArr[1]] && grp.child[textArr[1]].sapper_prop) {
            const label = grp.child[textArr[1]].sapper_prop.step + '_' + textArr[textArr.length - 1];
            spanArr[i].textContent = label;
            // spanArr[i].classList.add('tags', 'small-text', 'tag-editor');
            spanArr[i].setAttribute('data-id', textArr[1]);
            if (textArr[2] !== 'response') {
              textArr.splice(0, 2);
              spanArr[i].setAttribute('data-json-path', textArr.join('.'));
              spanArr[i].setAttribute('data-slot-type', 'subProcess');
            } else {
              textArr.splice(0, 3);
              spanArr[i].setAttribute('data-json-path', textArr.join('.'));
            }
          }
        }
      }
      content = tempPara.innerHTML;
      content = content.replace(/\${runtimeBean.resolveExpression\("_SE_{/g, '');
      content = content.replace(/}",execution\)}/g, '');
    }
    return content;
  }

  dataSourceSlotToTemp(content) {
    if (content && typeof content === 'string') {
      content = content.replace(/\<p>/g, '');
      content = content.replace(/\<br>/g, '');
      content = content.replace(/\<\/p>/g, '');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const spanArr = tempDiv.getElementsByTagName('span');
      // const l = spanArr.length;
      for (let i = spanArr.length; i >= 0; i--) {
        if (spanArr[i] && spanArr[i].getAttribute('data-id') && spanArr[i].getAttribute('data-json-path')) {
          if (spanArr[i].getAttribute('data-slot-type') === 'subProcess') {
            let slot = `data.${spanArr[i].getAttribute('data-id')}`;
            if (spanArr[i].getAttribute('data-json-path')) {
              slot = slot + `.${spanArr[i].getAttribute('data-json-path')}`;
            }
            spanArr[i].after(slot);
          } else {
            let slot = `data.${spanArr[i].getAttribute('data-id')}.response`;
            if (spanArr[i].getAttribute('data-json-path')) {
              slot = slot + `.${spanArr[i].getAttribute('data-json-path')}`;
            }
            spanArr[i].after(slot);
          }
          spanArr[i].remove();
        }
      }
      content = tempDiv.innerHTML;
      tempDiv.remove();
      content = content.replace(/<span>&nbsp;<\/span>/g, '');
      content = content.replace(/&gt;/g, '>');
      content = content.replace(/&lt;/g, '<');
      content = content.replace(/&nbsp;/g, ' ');
      content = content.replace(/<\/?span[^>]*>/g, '');
      content = content.replace(/<\/?a[^>]*>/g, '');
      content = content.replace(/<\/?div[^>]*>/g, '');
      content = content.replace(/\s\s+/g, ' ');
      content = content.replace(/response.response/g, 'response');

      content = "${runtimeBean.getList('" + content + "',execution)}";
    }
    return content;
  }

  dataSourceTempToSlot(content, dragDataObj) {
    if (content && typeof content === 'string') {
      content = content.replace(/\${runtimeBean.getList\('/g, `<span class='tags small-text tag-editor fr-deletable' contenteditable='false'>`);
      content = content.replace(/',execution\)}/g, '</span>');
      const tempPara = document.createElement('p');
      const jsPlumbInstance = jsPlumb.getInstance();
      tempPara.innerHTML = content;
      const spanArr = tempPara.getElementsByTagName('span');
      for (let i = 0; i < spanArr.length; i++) {
        const textArr = spanArr[i].innerText.split('.');
        if (dragDataObj[textArr[1]] && dragDataObj[textArr[1]].sapper_prop) {
          const label = dragDataObj[textArr[1]].sapper_prop.step + '_' + textArr[textArr.length - 1];
          spanArr[i].textContent = label;
          // spanArr[i].classList.add('tags', 'small-text', 'tag-editor');
          spanArr[i].setAttribute('data-id', textArr[1]);
          if (textArr[2] !== 'response') {
            textArr.splice(0, 2);
            spanArr[i].setAttribute('data-json-path', textArr.join('.'));
            spanArr[i].setAttribute('data-slot-type', 'subProcess');
          } else {
            textArr.splice(0, 3);
            spanArr[i].setAttribute('data-json-path', textArr.join('.'));
          }
        } else if (jsPlumbInstance['getGroupFor'](textArr[1])) {
          const grp = dragDataObj[jsPlumbInstance['getGroupFor'](textArr[1]).id];
          if (grp.child && grp.child[textArr[1]] && grp.child[textArr[1]].sapper_prop) {
            const label = grp.child[textArr[1]].sapper_prop.step + '_' + textArr[textArr.length - 1];
            spanArr[i].textContent = label;
            // spanArr[i].classList.add('tags', 'small-text', 'tag-editor');
            spanArr[i].setAttribute('data-id', textArr[1]);
            if (textArr[2] !== 'response') {
              textArr.splice(0, 2);
              spanArr[i].setAttribute('data-json-path', textArr.join('.'));
              spanArr[i].setAttribute('data-slot-type', 'subProcess');
            } else {
              textArr.splice(0, 3);
              spanArr[i].setAttribute('data-json-path', textArr.join('.'));
            }
          }
        }
      }
      content = tempPara.innerHTML;
    }
    return content;
  }

  filterMeta(arg0: any): any {
    return this.cleanObj(arg0);
  }

  cleanObj(object) {
    Object
      .entries(object)
      .forEach(([k, v]) => {
        if (v && typeof v === 'object') {
          this.cleanObj(v);
        }
        if (v && typeof v === 'object' && !Object.keys(v).length || v === null || v === undefined) {
          if (Array.isArray(object)) {
            object.splice(+k, 1);
          } else {
            delete object[k];
          }
        }
      });
    return object;
  }

  createFroalaOptions(value = '', setValue = ''): any {
    return {
      placeholderText: '',
      pastePlain: true,
      key: 'XAG4eF4J4C8B10A6B5C-11VKOJ1FGULVKHXDXNDXc1d1Kg1SNdD5B4A4B3H3A2A2B7C4A3==',
      toolbarInline: true,
      events: {
        initialized: (editor) => {
          if (setValue) {
            editor.getEditor().html.insert(setValue);
          }
          value = editor;
        },
        drop: (dropEvent) => {
          this.dropEvent(dropEvent, value);
        }
      }
    };
  }

  /**
    * Method is use to download file.
    * @param response - Array Buffer data
    * @param type - type of the document.
    */
  downLoadFile(response: any, type: string, fileName: string) {
    const blob = new Blob([JSON.stringify(response)], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + type;
    a.click();
  }

}
