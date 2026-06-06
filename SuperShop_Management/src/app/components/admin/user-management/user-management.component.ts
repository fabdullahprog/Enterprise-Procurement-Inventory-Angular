import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { AdminUser } from '../../../models/admin.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: AdminUser[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  filterRole = 'all';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to load users';
        this.loading = false;
      }
    });
  }

  get filteredUsers(): AdminUser[] {
    const search = this.searchTerm.toLowerCase().trim();
    return this.users.filter(user => {
      const matchesSearch =
        !search ||
        user.email.toLowerCase().includes(search) ||
        (user.fullName || '').toLowerCase().includes(search);

      const matchesRole =
        this.filterRole === 'all' ||
        (user.roles || []).some(role => role.toLowerCase() === this.filterRole.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }

  get allRoles(): string[] {
    return Array.from(new Set(this.users.flatMap(u => u.roles || []))).sort();
  }

  countByRole(role: string): number {
    return this.users.filter(u => (u.roles || []).includes(role)).length;
  }

  getRoleClass(role: string): string {
    const colors: Record<string, string> = {
      admin: 'role-admin',
      manager: 'role-manager',
      departmenthead: 'role-dept-head',
      purchaseofficer: 'role-purchase',
      purchasemanager: 'role-purchase-mgr',
      employee: 'role-employee'
    };
    return colors[role.toLowerCase()] || 'role-default';
  }

  getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      admin: '👑',
      manager: '💼',
      departmenthead: '🎯',
      purchaseofficer: '📦',
      purchasemanager: '🛒',
      employee: '👤'
    };
    return icons[role.toLowerCase()] || '👤';
  }

  formatDate(value?: string): string {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
