import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = environment.apiUrl + '/admin';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getDashboardStats(period: string = 'weekly'): Observable<any> {
        return this.http.get(`${this.apiUrl}/dashboard/stats?period=${period}`);
    }

    // Users
    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }

    createUser(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/users`, userData);
    }

    updateUser(id: string, userData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/users/${id}`, userData);
    }

    updateUserStatus(id: string, status: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/users/${id}/status`, { status });
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/users/${id}`);
    }

    updateUserRole(id: string, profile: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${id}/role`, { profile });
    }

    // --- Category APIs ---
    getAllCategories(): Observable<any> {
        return this.http.get(`${this.apiUrl}/categories`);
    }

    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/categories`);
    }

    createCategory(categoryData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/categories`, categoryData);
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/categories/${id}`);
    }

    // --- Shop APIs ---
    getAllShops(): Observable<any> {
        return this.http.get(`${this.apiUrl}/shops`);
    }

    createShop(shopData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/shops`, shopData);
    }

    updateShop(id: string, shopData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/shops/${id}`, shopData);
    }

    deleteShop(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/shops/${id}`);
    }

    // --- Event APIs ---
    getAllEvents(): Observable<any> {
        return this.http.get(`${this.apiUrl}/events`);
    }

    createEvent(eventData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/events`, eventData);
    }

    updateEvent(id: string, eventData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/events/${id}`, eventData);
    }

    deleteEvent(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/events/${id}`);
    }

    // --- Content Moderation APIs ---
    getPendingOffers(): Observable<any> {
        return this.http.get(`${this.apiUrl}/offers/pending`);
    }

    updateOfferStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/offers/${id}/status`, { status });
    }

    getAllReviews(): Observable<any> {
        return this.http.get(`${this.apiUrl}/reviews`);
    }

    deleteReview(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/reviews/${id}`);
    }

    // --- Search & Notifications ---
    globalSearch(query: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/search?q=${query}`);
    }

    getNotifications(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/notifications`);
    }

    markNotificationRead(id: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/notifications/${id}/read`, {});
    }

    markAllNotificationsRead(): Observable<any> {
        return this.http.put(`${this.apiUrl}/notifications/mark-all-read`, {});
    }

    deleteNotification(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/notifications/${id}`);
    }
}
