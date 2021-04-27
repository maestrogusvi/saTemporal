import {IBrand} from '../../interfaces/IBrand';
import {IOrgType} from '../../interfaces/IOrgType';

export interface IOrganization {
  id?: string;
  marketGroupId?: string;
  organizationName: string;
  hierarchy: string;
  parentOrganizationCode: string;
  status: string;
  active: number;
  orgUpdate: boolean;
  brand: string;
  brandArray: IBrand[];
  market?: string;
  region?: string;
  organizationType?: string;
  orgTypeArray?: IOrgType[];
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  partnerNumber?: string;
  phone1?: string;
  phone2?: string;
  optionalText1?: string;
  optionalText3?: string;
  optionalText4?: string;

}
