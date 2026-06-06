import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 
import { SubCategory } from '../models/sub-category.model'; 

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {
  private apiUrl = `${environment.apiUrl}/SubCategory`; 

  constructor(private http: HttpClient) {}

  
  getAllSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(this.apiUrl);
  }

  /**
   * Alias for compatibility with components
   */
  getAll(): Observable<SubCategory[]> {
    return this.getAllSubCategories();
  }

  
  getById(id: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.apiUrl}/${id}`);
  }

  
  getByCategoryId(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.apiUrl}/bycategory/${categoryId}`);
  }

  
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}