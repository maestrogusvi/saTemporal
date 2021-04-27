import {IBrand} from '../../interfaces/IBrand';
import {IOrgType} from '../../interfaces/IOrgType';

export interface IMarket {
  marketGroupId?: string,
  marketId?: string;
  country: string;
  name?: string;
  active: number;
  brands: string;
  brandArray?: IBrand[];
  orgTypes: string;
  orgTypeArray?: IOrgType[];

}


