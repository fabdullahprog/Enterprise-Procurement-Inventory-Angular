import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { DashboardService, DashboardStats, RecentActivity } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  isLoading = true;
  lastUpdated = new Date();

  summaryStats = {
    totalProducts: 0,
    totalSuppliers: 0,
    totalBatches: 0,
    totalDepartments: 0,
    totalPurchaseOrders: 0,
    lowStockItems: 0
  };

  recentActivities: RecentActivity[] = [];
  private refreshSub?: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.refreshSub = interval(15000).subscribe(() => this.loadStats());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data: DashboardStats) => {
        this.summaryStats = {
          totalProducts: data.totalProducts,
          totalSuppliers: data.totalSuppliers,
          totalBatches: data.totalBatches,
          totalDepartments: data.totalDepartments,
          totalPurchaseOrders: data.totalPurchaseOrders,
          lowStockItems: data.lowStockItems
        };
        this.recentActivities = data.recentActivities ?? [];
        this.lastUpdated = new Date();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard load error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  refreshNow(): void {
    this.isLoading = true;
    this.loadStats();
  }
}
