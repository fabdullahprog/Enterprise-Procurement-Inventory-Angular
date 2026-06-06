import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; 
import { Supplier, SupplierRequest } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = `${environment.apiUrl}/Supplier`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(supplier: SupplierRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, supplier);
  }

  update(id: number, supplier: SupplierRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, supplier);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}