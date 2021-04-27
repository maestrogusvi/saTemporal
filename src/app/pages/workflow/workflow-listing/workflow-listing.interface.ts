export interface IWorkflowData {
  id: string;
  name: string;
  description: string;
  preview?: any;
  applicationsUsed: any;
  type: string;
  failedJobs: number;
  succeededJobs: number;
  totalJobs: number;
  avgTime: string;
  tags: string[];
}

export interface IFlexOptions {
  layout: string;
  layoutxs?: string;
  layoutGap?: string;
  layoutAlign?: string;
  size?: string;
}

