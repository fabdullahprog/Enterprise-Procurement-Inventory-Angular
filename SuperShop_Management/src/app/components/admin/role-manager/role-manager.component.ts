import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { DepartmentService } from '../../../services/department.service';
import { AdminRole, AdminUser } from '../../../models/admin.model';
import { Department } from '../../../models/department.model';

@Component({
  selector: 'app-role-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.css']
})
export class RoleManagerComponent implements OnInit {
  loading = true;
  roles: AdminRole[] = [];
  users: AdminUser[] = [];
  departments: Department[] = [];
  error: string | null = null;
  creatingRoleName = '';

  assignUserId = 0;
  assignRoleName = '';
  assignDepartmentId = 0;
  listRolesUserId = 0;
  removeUserId = 0;
  removeRoleName = '';
  listedRoles: string[] | null = null;

  constructor(
    private adminService: AdminService,
    private departmentService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  get roleNames(): string[] {
    return this.roles
      .map(r => r.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }

  loadAll(): void {
    this.loading = true;
    this.error = null;
    forkJoin({
      roles: this.adminService.getRoles(),
      users: this.adminService.getUsers(),
      departments: this.departmentService.getAll()
    }).subscribe({
      next: ({ roles, users, departments }) => {
        this.roles = roles || [];
        this.users = users || [];
        this.departments = departments || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Failed to load role manager data');
        this.loading = false;
      }
    });
  }

  createRole(): void {
    const name = this.creatingRoleName.trim();
    if (!name) return;
    this.error = null;
    this.adminService.createRole(name).subscribe({
      next: () => {
        this.creatingRoleName = '';
        this.loadAll();
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Failed to create role');
      }
    });
  }

  deleteRole(name: string): void {
    if (!confirm(`Delete role "${name}"?`)) return;
    this.error = null;
    this.adminService.deleteRole(name).subscribe({
      next: () => this.loadAll(),
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Failed to delete role');
      }
    });
  }

  openPermissions(name: string): void {
    this.router.navigate(['/role-manager/permissions', encodeURIComponent(name)]);
  }

  addRoleToUser(): void {
    if (!this.assignUserId || !this.assignRoleName) return;
    const user = this.users.find(u => u.id === this.assignUserId);
    if (!user) return;
    const current = new Set<string>(user.roles || []);
    current.add(this.assignRoleName);
    this.error = null;
    this.adminService.setUserRoles(user.id, Array.from(current)).subscribe({
      next: () => {
        this.listedRoles = null;
        this.loadAll();
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Failed to assign role');
      }
    });
  }

  assignDepartmentToUser(): void {
    if (!this.assignUserId) return;
    this.error = null;
    this.adminService
      .setUserDepartment(this.assignUserId, this.assignDepartmentId || null)
      .subscribe({
        next: () => this.loadAll(),
        error: (err) => {
          this.error = this.getErrorMessage(err, 'Failed to assign department');
        }
      });
  }

  getRolesForUser(): void {
    const user = this.users.find(u => u.id === this.listRolesUserId);
    this.listedRoles = user?.roles || [];
  }

  removeRoleFromUser(): void {
    if (!this.removeUserId || !this.removeRoleName) return;
    const user = this.users.find(u => u.id === this.removeUserId);
    if (!user) return;
    const next = (user.roles || []).filter(r => r !== this.removeRoleName);
    this.error = null;
    this.adminService.setUserRoles(user.id, next).subscribe({
      next: () => {
        this.listedRoles = null;
        this.loadAll();
      },
      error: (err) => {
        this.error = this.getErrorMessage(err, 'Failed to remove role');
      }
    });
  }

  private getErrorMessage(err: { error?: { message?: string }; message?: string }, fallback: string): string {
    return err?.error?.message || err?.message || fallback;
  }
}
