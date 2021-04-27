export interface INode {
  id?: string;
  name: string;
  label?: string;
  description: string;
  connectionId: string;
  propertiesId: string;
  metaId: string;
  sapper_prop?: ISapperProp;
  sourceMetaId?: string;
  subProcessInputDataItem?: string;
  mappingId?: string;
  propertiesType?: string;
  type?: string;
  connectionType?: string;
}

export interface ISapperProp {
  sappertasktype: string;
  bpmnType: string;
  connectionType: string;
  top: number;
  taskCategory: string;
  logoPath: string;
  left: number;
  step: string;
}

export interface IwsdlProperties {
  name: string;
  documentation: string;
  portTypeName: string;
  operationName: string;
  serviceName: string;
  soapOperationNamespace: string;
  requestObjectName: string;
  responseObjectName: string;
  serviceEndPointNamespace: string;
  requestBody: null | string;
  url: string;
  application: any;
  version: any;
  isAddressing: boolean;
  customHeaderList: any;
  bindingName: string;

}

export interface IRequestBody {
  documentation: string;
  serviceEndPointNamespace: string;
  portTypeName: string;
  operationName: string;
  serviceName: string;
  soapOperationNamespace: string;
  requestObjectName: string;
  responseObjectName: string;
  url: string;
  bindingName: string;
}
export interface ITaskMap {
  [id: string]: INode;
}

export interface IProcessProp {
  id?: string;
  name: string;
  documentation: string;
  isExecutable?: string;
}

export interface IProcess {
  processProp: IProcessProp;
  sequenceFlow?: [];
  startEvent?: INode;
  endEvent?: INode;
}

export interface IWorkflowPayload {
  process: IProcess;
}

export interface IWorkflow {
  id?: string;
  name: string;
  description: string;
  numPartitions: number;
  reportTopic: string;
  tasks: ITaskMap;
}
export interface IWorkflowSoap {
  id?: string;
  name: string;
  description: string;
  wsdlurl: string;
}
export interface ITaskProperties {
  directoryPath: string;
  regularExpression?: string;
  fileName?: string;
  apiURI?: string;
  files: any[];
  requestBody?: string;
  csvParserInputType?: string;
  csvData?: string;
  data?: string;
  inputType?: string;
  parserOption?: string;
  query?: string;
  isBatchExecution?: boolean;
  queryType?: string;
  namedParameters?: any;
  batchDataExpression?: string;
  collectorInput?: string;
}

export interface ISinkTaskProperties {
  directoryPath: string;
  fileName: string;
  data?: string;
}
export interface ISaveTaskProperties {
  id?: string;
  name: string;
  description: string;
  propertiesType: string;
  taskProperties: ITaskProperties;
  additionalProperties: IadditionalProperties;
}

/**
 * Tree Node Interface
 */
export interface ITreeNode {
  name: string;
  children?: ITreeNode[];
  expanded: boolean;
}

export interface IErrorJson {
  name: string;
  description: string;
  tasks: IErrorTask[];
}

export interface IErrorTask {
  id: string;
  name: string;
  status: string;
  message: string;
}

export interface IWorkflowDetails {
  name: string;
  description: string;
  template: string;
}

export interface IadditionalProperties {
  backupRemoteFile: boolean;
  encoding: string;
  deleteRemoteFile: boolean;
  isRemoteFileEncrypted: boolean;
  decryptionKey: string;
  regularExpression: string;
}

export interface IDefaultProperties {
  value: string;
  label: string;
}

export interface ICloneAutomation {
  workflowName: string;
  workflowId: string;
}
