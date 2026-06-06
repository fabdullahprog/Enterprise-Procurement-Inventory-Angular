import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, filter, finalize, map, switchMap, takeUntil } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { RolePermissions } from '../../../models/admin.model';

const CONTROLLERS = [
  { label: 'Order', key: 'order' },
  { label: 'Product', key: 'product' },
  { label: 'ProductCategory', key: 'productcategory' }
];

const ACTIONS = ['view', 'details', 'create', 'edit', 'delete'];

/** API may return camelCase or PascalCase depending on serializer settings. */
function normalizeRolePermissions(data: RolePermissions & Record<string, unknown>): {
  permissions: string[];
  allPermissions: string[];
} {
  const permissions = (data.permissions ?? data['Permissions'] ?? []) as string[];
  const allPermissions = (data.allPermissions ?? data['AllPermissions'] ?? []) as string[];
  return {
    permissions: Array.isArray(permissions) ? permissions : [],
    allPermissions: Array.isArray(allPermissions) ? allPermissions : []
  };
}

@Component({
  selector: 'app-role-permissions',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './role-permissions.component.html',
  styleUrls: ['./role-permissions.component.css']
})
export class RolePermissionsComponent implements OnInit, OnDestroy {
  readonly controllers = CONTROLLERS;
  readonly actions = ACTIONS;

  roleName = '';
  loading = true;
  saving = false;
  allPermissions: string[] = [];
  selected = new Set<string>();
  error: string | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const snapshotName = this.route.snapshot.paramMap.get('roleName');
    if (snapshotName) {
      this.roleName = decodeURIComponent(snapshotName);
    }

    this.route.paramMap
      .pipe(
        map(params => decodeURIComponent(params.get('roleName') ?? '')),
        filter(name => {
          if (!name) {
            this.error = 'Role name is missing. Go back and open permissions from the role list.';
            this.loading = false;
            this.cdr.markForCheck();
            return false;
          }
          this.roleName = name;
          return true;
        }),
        switchMap(name => {
          this.loading = true;
          this.error = null;
          return this.adminService.getRolePermissions(name).pipe(
            finalize(() => {
              this.loading = false;
              this.cdr.markForCheck();
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          const mapped = normalizeRolePermissions(data as RolePermissions & Record<string, unknown>);
          this.allPermissions = mapped.allPermissions;
          this.selected = new Set(mapped.permissions);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.error =
            err?.error?.message ||
            err?.message ||
            (err?.status === 401 || err?.status === 403
              ? 'Not authorized. Log in as Admin or Manager.'
              : 'Failed to load permissions. Is the API running?');
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get matrixKeys(): string[] {
    return CONTROLLERS.flatMap(c => ACTIONS.map(a => this.matrixPermission(c.key, a)));
  }

  get additionalPermissions(): string[] {
    return this.allPermissions.filter(p => !this.matrixKeys.includes(p));
  }

  matrixPermission(controllerKey: string, action: string): string {
    return `${controllerKey}:${action}`;
  }

  isSelected(permission: string): boolean {
    return this.selected.has(permission);
  }

  toggle(permission: string): void {
    if (this.selected.has(permission)) {
      this.selected.delete(permission);
    } else {
      this.selected.add(permission);
    }
  }

  save(): void {
    this.saving = true;
    this.error = null;
    this.adminService.setRolePermissions(this.roleName, Array.from(this.selected)).subscribe({
      next: () => {
        alert('Permissions saved successfully');
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to save permissions';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  back(): void {
    this.router.navigate(['/role-manager']);
  }
}
