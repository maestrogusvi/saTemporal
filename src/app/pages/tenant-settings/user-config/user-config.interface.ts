
export interface UserData {
    id?: string;
    name: string;
    email: string;
    enabled: boolean;
    tenantName: string;
    firstTimeLogin: boolean;
    oldPasswordMap: any;
    isPasswordExpired: boolean;
    changePasswordDate: string;
    authorities: [];
}
