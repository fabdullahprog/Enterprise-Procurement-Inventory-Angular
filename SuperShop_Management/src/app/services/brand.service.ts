import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Environment and Model imports - Path updated to point correct folders
import { environment } from '../environments/environment'; 
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  // Base API URL for the Brand controller from environment file
  private apiUrl = `${environment.apiUrl}/Brand`;

  constructor(private http: HttpClient) { }

  /**
   * GET: Fetch all brands from the database
   */
  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  /**
   * GET: Fetch a single brand detail by its ID
   * @param id The unique identifier of the brand
   */
  getById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/${id}`);
  }

  /**
   * POST: Create and save a new brand record
   * @param brand The brand object to be created
   */
  create(brand: Brand): Observable<any> {
    return this.http.post(this.apiUrl, brand);
  }

  /**
   * PUT: Update an existing brand record
   * @param id The ID of the brand to update
   * @param brand The updated brand data
   */
  update(id: number, brand: Brand): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, brand);
  }

  /**
   * DELETE: Remove a brand record from the database
   * @param id The ID of the brand to delete
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}