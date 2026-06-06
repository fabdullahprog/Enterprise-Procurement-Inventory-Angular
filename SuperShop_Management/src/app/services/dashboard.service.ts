import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface RecentActivity {
  id: number;
  message: string;
  time: string;
  status: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  totalBatches: number;
  totalDepartments: number;
  totalPurchaseOrders: number;
  lowStockItems: number;
  recentActivities: RecentActivity[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}
