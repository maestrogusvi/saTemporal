import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'metaJsonToTreeFormat'
})
export class MetaJsonToTreeFormatPipe implements PipeTransform {
    parentId;
    transform(value, key): any {
        this.parentId = value.id;
        return this.getArrayObject(value, key, this.parentId, key);
    }

    private getArrayObject(schemaObject: any, key: string, id: string, fullName: string): any {
        if (schemaObject) {
            if (schemaObject.id !== this.parentId) {
                // id = `${id}.${schemaObject.id}`;
                fullName = `${fullName}.${key}`;
            }
            if (key === 'items') {
                // id += '[0]';
                fullName += '[0]';
            }
            if (schemaObject.type === 'object' && schemaObject.order) {
                return this.createObj(schemaObject, key, schemaObject.id, fullName);
            } else if (schemaObject.type === 'array') {
                return this.createArr(schemaObject, key, schemaObject.id, fullName);
            } else {
                return this.createKey(schemaObject, key, schemaObject.id, fullName);
            }
        }
    }

    private createObj(schemaObject, key: string, id: string, fullName: string) {
        const arrayObject = {
            name: key,
            children: [],
            type: 'object',
            id,
            fullName,
            order: schemaObject.order
        };
        const schemaObj = schemaObject.properties;
        for (const propertyKey in schemaObj) {
            if (schemaObj[propertyKey].order) {
                arrayObject.children[schemaObj[propertyKey].order - 1] = this.getArrayObject(schemaObj[propertyKey], propertyKey, id, fullName);
            } else {
                if (typeof (schemaObj[propertyKey]) === 'object') {
                    arrayObject.children.push(this.getArrayObject(schemaObj[propertyKey], propertyKey, id, fullName));
                }
            }
        }
        return arrayObject;
    }

    private createArr(schemaObject, key: string, id: string, fullName: string) {
        const arrayObject = {
            name: key,
            children: [],
            type: 'array',
            id,
            fullName,
            order: schemaObject.order
        };
        for (const propertyKey in schemaObject) {
            if (propertyKey === 'items' && schemaObject.items.type === 'object') {
                for (const propKey in schemaObject.items.properties) {
                   // if (propKey !== 'type') {
                        arrayObject.children.push(this.getArrayObject(schemaObject.items.properties[propKey], propKey, id, fullName));
                    // }
                }
            }
        }
        return arrayObject;
    }

    private createKey(schemaObject, key: string, id: string, fullName: string) {
        const arrayObject = schemaObject;
          arrayObject['name'] = (schemaObject['ui-label'] && schemaObject['ui-label']['en_US']) ? schemaObject['ui-label']['en_US'] : key;
          arrayObject['children'] = [];
          arrayObject['id'] = id;
          arrayObject['fullName'] = fullName;
          arrayObject['order'] = schemaObject.order;
        return arrayObject;
    }
}
