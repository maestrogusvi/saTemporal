import {IBrand} from '../../interfaces/IBrand';
import {IOrgType} from '../../interfaces/IOrgType';

export interface IMarketGroup {
  groupId?: string;
  sapperTenant: string;
  hierarchyName: string;
  groupName: string;
  sumtotalProdURL?: string;
  sumtotalStageURL?: string;
  topDomain?: [];
  brands: string;
  brandArray: IBrand[];
  orgTypes: string;
  orgTypeArray: IOrgType[];
  active: boolean;
  oem: boolean;
  useRegions: boolean;
  comments: string;


}


