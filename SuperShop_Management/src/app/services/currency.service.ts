import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Currency, CurrencyRequest } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private apiUrl = `${environment.apiUrl}/Currency`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.apiUrl);
  }

  getById(id: number): Observable<Currency> {
    return this.http.get<Currency>(`${this.apiUrl}/${id}`);
  }

  create(currency: CurrencyRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, currency);
  }

  update(id: number, currency: CurrencyRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, currency);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}