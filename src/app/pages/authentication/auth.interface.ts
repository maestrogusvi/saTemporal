export interface IRegisterUser {
  adminName: string;
  companyName: string;
  businessEmail: string;
  tenantName: string;
  contactNumber: string;
  domain: string;
}

export interface IForgotPassword {
  businessEmail: string;
}

export interface IResetPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
