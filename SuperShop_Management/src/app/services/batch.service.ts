import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Batch, BatchCreateDto } from '../models/batch.model';

@Injectable({ providedIn: 'root' })
export class BatchService {
  private apiUrl = `${environment.apiUrl}/Batch`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Batch[]> {
    return this.http.get<Batch[]>(this.apiUrl);
  }

  create(dto: BatchCreateDto): Observable<any> {
    return this.http.post(this.apiUrl, dto);
  }

  update(id: number, dto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}