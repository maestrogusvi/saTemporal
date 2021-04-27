export interface IApplicationNode {
  id?: string;
  name: string;
  description: string;
  logoPath: string;
  versions: string[];
  categories: string[];
  type: string;
  objectUrl: string;
  checked?: boolean;
}

export interface IApplicationLov {
  id: string;
  name: string;
}
