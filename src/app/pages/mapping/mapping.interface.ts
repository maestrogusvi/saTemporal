interface ITreeNodes {
    'type': string;
    'order': string;
    'isAuditable': boolean;
    'isCacheable': boolean;
    'isPersistable': boolean;
    'isPrimaryKey': boolean;
    'id': string;
    'ui-label': {
        'en_US': string
    };
    'name': string;
    'parent': string;
    'children': Array<any>;
    'fullName': string;
    'isArray': boolean;
}

interface IMapping {
    'id'?: string;
    'mappings': IMappings;
    'dataSourceList': IDataList[];
    'dataTargetList': IDataList[];
}

interface IDataList {
    'id': string;
    'type': string;
    'order': number;
    'alise'?: string;
}

interface IMappings {
    'mapping': IMappingRow[];
}
interface IMappingRow {
    'inputFields': IInputOutputField[];
    'outputFields': IInputOutputField[];
    'mappingTypeEnum': string;
    'mappingId': string;
    'expression': string;
    'customExpression'?: ICustomExpression;
}
interface IInputOutputField {
    'id'?: string;
    'path': string;
    'fieldType': string;
    'fieldName': string;
    'actions': Array<any>;
    'alais': string;
    'status'?: string;
    'transformation': any;
    'sourceDocId'?: string;
    'index'?: number;
}

interface ICustomExpression {
    'language': string;
    'script': string;
    'functionName': string;
    'sourceDocId': string;
}

export { ITreeNodes, IMappings, IMapping, IMappingRow, IInputOutputField, ICustomExpression, IDataList };

