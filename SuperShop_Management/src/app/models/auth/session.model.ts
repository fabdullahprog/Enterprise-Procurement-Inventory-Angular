export interface AuthSession {
  token: string;
  userId: number;
  email: string;
  roles: string[];
  permissions: string[];
  departmentId?: number | null;
  departmentName?: string | null;
}

export interface MeResponse {
  id: number;
  email: string;
  fullName: string;
  createdDate: string;
  departmentId?: number | null;
  departmentName?: string | null;
  roles: string[];
  permissions: string[];
}
