import {IBrand} from '../../interfaces/IBrand';
import {ISTRole} from './st-role.interface';
import {IGrpRole} from './grp-role.interface';

export interface IRoleMapping {
  marketGroupId?: string;
  id?: string;
  stRole: ISTRole;
  brand: IBrand;
  grpRole: IGrpRole;
}


