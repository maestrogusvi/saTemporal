import {IBrand} from '../../interfaces/IBrand';

export interface IGrpRole {
  marketGroupId?: string;
  id?: number;
  grpRoleId?: number;
  brand?: string;
  grpRoleName: string;
  manageOrg?: boolean;
  priority?: number;
}


