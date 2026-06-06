export interface AdminRole {
  name: string;
}

export interface AdminUser {
  id: number;
  email: string;
  roles: string[];
  departmentId?: number | null;
  departmentName?: string | null;
  fullName?: string | null;
  createdDate?: string;
}

export interface RolePermissions {
  role: string;
  permissions: string[];
  allPermissions: string[];
}
