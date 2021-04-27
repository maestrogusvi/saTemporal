class Schedule {
    id?: string;
    jobClass: string;
    jobIdentifierKey: string;
    triggerIdentifierKey: string;
    startDate: string;
    endDate: string;
    cronExpression: string;
    jobIdentifierKeyGroup?: string;
    triggerIdentifierGroup?: string;
    nextFireTime?: string;
    schedulerPaused?: boolean;
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
}

export { Schedule };
