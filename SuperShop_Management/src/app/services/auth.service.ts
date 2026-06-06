import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginRequest, RegisterRequest } from '../models/auth/auth.model';
import { AuthSession, MeResponse } from '../models/auth/session.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLES_KEY = 'auth_roles';
  private readonly PERMISSIONS_KEY = 'auth_permissions';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthSession & { message?: string }> {
    return this.http.post<AuthSession & { message?: string }>(`${this.apiUrl}/Auth/login`, credentials).pipe(
      tap(response => this.persistSession(response))
    );
  }

  register(userData: RegisterRequest): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/Auth/register`, userData);
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/Auth/me`);
  }

  refreshSession(): Observable<MeResponse> {
    return this.getMe().pipe(
      tap(me => {
        localStorage.setItem(this.ROLES_KEY, JSON.stringify(me.roles ?? []));
        localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(me.permissions ?? []));
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRoles(): string[] {
    return JSON.parse(localStorage.getItem(this.ROLES_KEY) ?? '[]') as string[];
  }

  getPermissions(): string[] {
    return JSON.parse(localStorage.getItem(this.PERMISSIONS_KEY) ?? '[]') as string[];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLES_KEY);
    localStorage.removeItem(this.PERMISSIONS_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token.length > 0;
  }

  private persistSession(response: AuthSession): void {
    if (response?.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    }
    localStorage.setItem(this.ROLES_KEY, JSON.stringify(response.roles ?? []));
    localStorage.setItem(this.PERMISSIONS_KEY, JSON.stringify(response.permissions ?? []));
  }
}
