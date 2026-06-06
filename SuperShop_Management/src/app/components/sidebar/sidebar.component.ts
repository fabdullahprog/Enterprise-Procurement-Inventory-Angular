import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeMenu: string = 'catalog'; 

  @Output() logoutEvent = new EventEmitter<void>();
  // Getter properties for template compatibility
  get isCatalogOpen(): boolean {
    return this.isMenuOpen('catalog');
  }

  // get isInventoryOpen(): boolean {
  //   return this.isMenuOpen('inventory');
  // }

  get isPurchaseOpen(): boolean {
    return this.isMenuOpen('purchase');
  }

  get isReportsOpen(): boolean {
    return this.isMenuOpen('reports');
  }

  get isAdminOpen(): boolean {
    return this.isMenuOpen('admin');
  }
  
  toggleMenu(menuName: string): void {
    if (this.activeMenu === menuName) {
      this.activeMenu = '';
    } else {
      this.activeMenu = menuName;
    }
  }

  isMenuOpen(menuName: string): boolean {
    return this.activeMenu === menuName;
  }

  onLogout(): void {
    this.logoutEvent.emit();
  }
}