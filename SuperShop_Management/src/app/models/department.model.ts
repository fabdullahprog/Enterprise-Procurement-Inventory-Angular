export interface Department {
  departmentId: number;
  departmentCode: string;
  departmentName: string;
  description?: string;
  departmentEmail?: string;
  departmentPhone?: string;
  location?: string;
  canRequestItem: boolean;
  canIssueItem: boolean;
  isActive: boolean;
  createdDate: Date;
  createdBy?: string;
}