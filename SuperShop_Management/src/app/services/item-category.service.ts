import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ItemCategory } from '../models/item-category.model';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemCategoryService {
  private apiUrl = `${environment.apiUrl}/ItemCategory`;
  
  // Cache for getAllCategories to avoid multiple API calls
  private allCategoriesCache$: Observable<ItemCategory[]> | null = null;

  constructor(private http: HttpClient) { }

  
  getAllCategories(): Observable<ItemCategory[]> {
    if (!this.allCategoriesCache$) {
      this.allCategoriesCache$ = this.http.get<ItemCategory[]>(this.apiUrl).pipe(
        shareReplay(1)  // Cache the response and share it across subscribers
      );
    }
    return this.allCategoriesCache$;
  }
  /**
   * Alias method for compatibility with existing components
   */
  getAll(): Observable<ItemCategory[]> {
    return this.getAllCategories();
  }
  
  getById(id: number): Observable<ItemCategory> {
    return this.http.get<ItemCategory>(`${this.apiUrl}/${id}`);
  }

  
  create(category: any): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  
  update(id: number, category: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  
  clearCache(): void {
    this.allCategoriesCache$ = null;
  }
}