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

    private getRoleKey(): string {
        const path = window.location.pathname;
        if (path.startsWith('/admin')) return 'admin_token';
        if (path.startsWith('/shop')) return 'shop_token';
        return 'customer_token';
    }

    getCurrentRole(): 'ADMIN' | 'SHOP' | 'CUSTOMER' {
        const path = window.location.pathname;
        if (path.startsWith('/admin')) return 'ADMIN';
        if (path.startsWith('/shop')) return 'SHOP';
        return 'CUSTOMER';
    }

    getRedirectPath(role?: string): string {
        const r = role || this.getCurrentRole();
        if (r === 'ADMIN') return '/admin/login'; // Adjust if admin login is different
        if (r === 'SHOP') return '/auth/login';
        return '/auth/login';
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

    setToken(token: string, role?: string) {
        if (this.isBrowser) {
            const key = role ? (role === 'ADMIN' ? 'admin_token' : role === 'SHOP' ? 'shop_token' : 'customer_token') : this.getRoleKey();
            localStorage.setItem(key, token);
        }
    }

    getToken(): string | null {
        if (this.isBrowser) {
            const key = this.getRoleKey();
            const token = localStorage.getItem(key);
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
            const key = this.getRoleKey();
            localStorage.removeItem(key);
        }
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    forgotPassword(email: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, { email });
    }

    resetPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/reset-password`, { token, newPassword });
    }
}
