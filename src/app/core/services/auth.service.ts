import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl + '/auth';
    private isBrowser: boolean;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) platformId: any
    ) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    login(credentials: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(res => this.setToken(res.token))
        );
    }

    registerCustomer(userData: any): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/customer/sign-up`, userData).pipe(
            tap(res => this.setToken(res.token))
        );
    }

    setToken(token: string) {
        if (this.isBrowser) {
            localStorage.setItem('auth_token', token);
        }
    }

    getToken(): string | null {
        if (this.isBrowser) {
            const token = localStorage.getItem('auth_token');
            if (token && this.isTokenExpired(token)) {
                this.logout();
                return null;
            }
            return token;
        }
        return null;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (!payload.exp) return false;
            const expirationDate = new Date(payload.exp * 1000);
            return expirationDate < new Date();
        } catch (e) {
            return true;
        }
    }

    logout() {
        if (this.isBrowser) {
            localStorage.removeItem('auth_token');
            // We don't necessarily redirect here to avoid circular dependencies if used in Guards
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}
