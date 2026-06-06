import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Grn {
  id: number;
  grnNumber: string;
}

@Injectable({ providedIn: 'root' })
export class GrnService {
  private apiUrl = `${environment.apiUrl}/GRN`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Grn[]> {
    return this.http.get<Grn[]>(this.apiUrl);
  }
}
