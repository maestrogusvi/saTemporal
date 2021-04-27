export interface IConnections {
  id?: string;
  name: string;
  type: string;
  description: string;
  applicationName: string;
  applicationId: string;
  connectionProperties: IConnectionProperties;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  requestBody?: string;

}

export interface IConnectionProperties {
  hostName?: string;
  port?: number;
  username?: string;
  password?: string;
  passwordTypeEnum?: string;
  fileId?: string;
  sftpConnectionType?: string;
  bucketName?: string;
  accessKey?: string;
  secretAccessKey?: string;
  region?: string;
  authorizationUrl?: string;
  httpMethod?: string;
  contentType?: string;
  httpHeaders?: object;
  queryParams?: object;
  connectionHttpMethod?: string;
  connectionQueryParameters?: IConnectionQueryParameters;
  grantType?: string;
  redirectUrl?: string;
  authUrl?: string;
  accessTokenUrl?: string;
  clientId?: string;
  clientSecret?: string;
  scope?: string;
  state?: string;
  responseType?: string;
  key?: string;
  value?: string;
  addTo?: string;
  headerField?: string;
  headerPrefix?: string;
  database?: string;
  url?: string;
  driverClassName?: string;
  requestBody?: string;
}

export interface IHttpHeaders {
  user: string;
  password: string;
}
export interface IConnectionQueryParameters {
  access_token: string;
}
