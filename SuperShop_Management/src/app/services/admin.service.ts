import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AdminRole, AdminUser, RolePermissions } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<AdminRole[]> {
    return this.http.get<AdminRole[]>(`${this.apiUrl}/roles`);
  }

  createRole(name: string): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/roles`, { name });
  }

  renameRole(roleName: string, name: string): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/roles/${encodeURIComponent(roleName)}`, { name });
  }

  deleteRole(roleName: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/roles/${encodeURIComponent(roleName)}`);
  }

  getRolePermissions(roleName: string): Observable<RolePermissions> {
    return this.http.get<RolePermissions>(
      `${this.apiUrl}/roles/${encodeURIComponent(roleName)}/permissions`
    );
  }

  setRolePermissions(roleName: string, permissions: string[]): Observable<unknown> {
    return this.http.put(
      `${this.apiUrl}/roles/${encodeURIComponent(roleName)}/permissions`,
      { permissions }
    );
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  setUserRoles(userId: number, roles: string[]): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/users/${userId}/roles`, { roles });
  }

  setUserDepartment(userId: number, departmentId: number | null): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/users/${userId}/department`, { departmentId });
  }
}
