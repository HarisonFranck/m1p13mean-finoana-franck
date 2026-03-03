import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Shop Profile
    getMyShop(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/shops/my-shop`);
    }

    updateShopProfile(profileData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/shops/my-shop/profile`, profileData);
    }

    // Offers
    getMyOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offers/my-offers`);
    }

    createOffer(offerData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/offers`, offerData);
    }

    updateOffer(id: string, offerData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/offers/${id}`, offerData);
    }

    deleteOffer(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/offers/${id}`);
    }

    // Reviews
    replyToReview(reviewId: string, comment: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/reviews/${reviewId}/reply`, { comment });
    }

    // Stats
    getStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/shops/my-shop/stats`);
    }

    // Products
    getMyProducts(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products/my-products`);
    }

    createProduct(productData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/products`, productData);
    }

    updateProduct(id: string, productData: FormData): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/products/${id}`, productData);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/products/${id}`);
    }
}
