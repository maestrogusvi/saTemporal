
export interface AdditionalProperties {
    key: string;
    value: string;
}

export interface AdditionalPropertiesOptions {
    fields: Fields[];
}
export interface Fields {
    fieldName: string;
    fieldValue: FieldValue;
    uiLabel: string;
    uiHintText: string;
    regexEnabled: string;
}
export interface FieldValue {
    fieldValueType: string;
    possibleValues: [];
    defaultValue: string;
}

export interface ISoapProperties {
    name: string;
    documentation: string;
    serviceEndPointNamespace: string;
    portTypeName: string;
    operationName: string;
    serviceName: string;
    soapOperationNamespace: string;
    requestObjectName: string;
    responseObjectName: string;
    requestBody: string;
    url: string;
    application: string;
    version: string;
}

export interface ITransformationProperties {
    sourceDataObject: string;
}

export interface IfixedWidthParser {
    parserOption: string;
    fileName: string;
    data: string;
};

export interface ICsvParser {
    csvParserInputType: string;
    csvData: string;
}

export interface ICsvConverter {
    inputType: string;
    data: string;
}

export interface ICollectorProperties {
    collectorInput: string;
}
