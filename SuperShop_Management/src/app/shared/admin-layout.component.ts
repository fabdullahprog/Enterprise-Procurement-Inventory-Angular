import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../components/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="admin-container">
      <app-sidebar (logoutEvent)="handleLogout()"></app-sidebar>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-container { 
      display: flex; 
      height: 100vh; 
      width: 100vw;
      overflow: hidden; 
    }
    .content { 
      flex-grow: 1; 
      background: #f1f5f9; 
      overflow-y: auto; 
      padding: 0; 
    }
  `]
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}