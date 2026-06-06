import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnitSet } from '../models/unit-set.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class UnitSetService {
  private apiUrl = `${environment.apiUrl}/UnitSet`; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<UnitSet[]> {
    return this.http.get<UnitSet[]>(this.apiUrl);
  }

  create(data: UnitSet): Observable<UnitSet> {
    return this.http.post<UnitSet>(this.apiUrl, data);
  }

  update(id: number, data: UnitSet): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}