import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UnitService {
  private apiUrl = `${environment.apiUrl}/Unit`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.apiUrl);
  }

  getById(id: number): Observable<Unit> {
    return this.http.get<Unit>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}