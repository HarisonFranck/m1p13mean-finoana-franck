import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Shops
    getShops(params: any = {}): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops`, { params });
    }

    getShopDetails(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/shops/${id}`);
    }

    // Categories
    getCategories(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops/categories`);
    }

    // Products
    getProducts(params: any = {}): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/articles`, { params });
    }

    // Favorites
    getFavorites(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users/favorites`);
    }

    addFavorite(shopId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/users/favorites/${shopId}`, {});
    }

    removeFavorite(shopId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/users/favorites/${shopId}`);
    }

    // Reviews
    getReviews(targetType: string, idTarget: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/reviews/${targetType}/${idTarget}`);
    }

    postReview(review: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/reviews`, review);
    }

    // Offers/Events
    getOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offers`);
    }
}
