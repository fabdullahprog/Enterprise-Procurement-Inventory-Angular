import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminLayoutComponent } from './shared/admin-layout.component';
import { authGuard } from './guards/auth.guard';

// Components (Direct Import)
import { UnitComponent } from './components/catalog/unit/unit.component';
import { UnitSetComponent } from './components/catalog/unit-set/unit-set.component';
import { ProductComponent } from './components/catalog/product/product.component';
import { SupplierComponent } from './components/purchase/supplier/supplier.component';
import { CurrencyComponent } from './components/catalog/currency/currency.component';
// import { BatchComponent } from './components/inventory/batch/batch.component';
import { CombinedReportComponent } from './components/reports/combined-report/combined-report.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent)
      },

      {
        path: 'departments',
        loadComponent: () => import('./components/catalog/department/department.component').then(m => m.DepartmentComponent)
      },
      {
        path: 'brands',
        loadComponent: () => import('./components/catalog/brand-list/brand-list.component').then(m => m.BrandListComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/catalog/item-category/item-category.component').then(m => m.ItemCategoryComponent)
      },
      {
        path: 'sub-categories',
        loadComponent: () => import('./components/catalog/sub-category/sub-category.component').then(m => m.SubCategoryComponent)
      },

      { path: 'units', component: UnitComponent },
      { path: 'unit-sets', component: UnitSetComponent },
      { path: 'products', component: ProductComponent },
      { path: 'currencies', component: CurrencyComponent },

      // { path: 'suppliers', component: SupplierComponent },
      // { path: 'batches', component: BatchComponent },

      { path: 'reports/category-subcategory', component: CombinedReportComponent },

      // Role management (specific route before role-manager prefix)
      {
        path: 'role-manager/permissions/:roleName',
        loadComponent: () =>
          import('./components/admin/role-permissions/role-permissions.component').then(m => m.RolePermissionsComponent)
      },
      {
        path: 'role-manager',
        pathMatch: 'full',
        loadComponent: () =>
          import('./components/admin/role-manager/role-manager.component').then(m => m.RoleManagerComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/user-management/user-management.component').then(m => m.UserManagementComponent)
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];