export interface IPasswordPolicy {
    id?: string;
    oldPasswordLimit: number;
    passwordRegex: string;
    passwordErrorMessage: string;
    passwordExpiryDays: number;
    failedAttemptTime: number;
    failedAttemptLimit: number;
    tenantName: string;
}
