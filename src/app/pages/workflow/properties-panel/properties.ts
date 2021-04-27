import { ISoapProperties } from "./properties.interface";

export class HTTPTaskProperties {
    name: string;
    apiURI: string;
    httpMethod: string;
    requestBody: string;
    queryParameters: {};
    httpHeaders: {};
    responseContentType: string;
    requestContentType: string;

    constructor() {
        this.name = '';
        this.apiURI = '';
        this.httpMethod = '';
        this.requestBody = '';
        this.queryParameters = this.queryParameters;
        this.httpHeaders = this.httpHeaders;
        this.responseContentType = '';
        this.requestContentType = '';
    }
}

class TransformProps {
  type: 'SLOT'|'FILE';
  value: string;
  id: string;
}

export class TransformationProperties {

    sourceMeta: TransformProps;
    targetMeta: TransformProps;

    constructor() {
      this.sourceMeta = {
        type: 'SLOT',
        value: '',
        id: ''
      };
      this.targetMeta = {
        type: 'SLOT',
        value: '',
        id: ''
      };
    }
}

export class FTPSourceProperties {

    directoryPath: string;
    regularExpression: string;
    files: Array<any>;

    constructor() {
        this.directoryPath = '';
        this.regularExpression = '';
        this.files = [];
    }
}

export class FTPSinkProperties {

    directoryPath: string;
    fileName: string;
    data: string;

    constructor() {
        this.directoryPath = '';
        this.fileName = '';
        this.data = '';
    }
}

export class SqlClientProperties {

    query: string;
    queryType: string;
    namedParameters: any;
    isBatchExecution: boolean;
    batchDataExpression: string;

    constructor() {
        this.query = '';
        this.queryType = '';
        this.namedParameters = {};
        this.isBatchExecution = false;
        this.batchDataExpression = '';
    }
}

export class SoapProperties {

    soapTaskProperties: ISoapProperties = {
        name: '',
        documentation: `This operation retrieves data related to a Location for the specified criteria.
        request criteria can be for a single entry based on a Reference ID;
        ation Name or all Locations will be retrieved if no criteria is specified`,
        serviceEndPointNamespace: 'https://wd2-impl-services1.workday.com/ccx/service/iadmin_dpt2/Human_Resources/',
        portTypeName: 'Human_ResourcesPort',
        operationName: 'Get_Locations',
        serviceName: 'Human_ResourcesService',
        soapOperationNamespace: 'urn:com.workday/bsvc/Human_Resources',
        requestObjectName: 'Get_Locations_Request',
        responseObjectName: 'Get_Locations_Response',
        requestBody: null,
        url: '',
        application: '',
        version: ''
    };

    constructor() { }
}

export class FixedWidthParserProperties {

    parserOption: string;
    fileName: string;
    data: string;

    constructor() {
        this.parserOption = '';
        this.fileName = '';
        this.data = '';
    }
}

export class CSVParserProperties {

    csvParserInputType: string;
    csvData: string;

    constructor() {
        this.csvParserInputType = '';
        this.csvData = '';
    }
}

export class CSVConverterProperties {

    inputType: string;
    data: string;

    constructor() {
        this.inputType = '';
        this.data = '';
    }
}

export class CollectorProperties {

    collector: string;

    constructor() {
        this.collector = '';
    }
}

export class SubProcessProperties {

    subProcessInputDataItem: string;

    constructor() {
        this.subProcessInputDataItem = '';
    }
}
