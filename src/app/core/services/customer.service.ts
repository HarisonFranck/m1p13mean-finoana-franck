import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private apiUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) { }

    // Shop 
    getAllShops(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops`);
    }

    // Offers
    getAllActiveOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offers/active`);
    }

    // Products
    getFilteredProducts(filters: { [key: string]: any }): Observable<any[]> {
        let params = new HttpParams();

        for (const key in filters) {
            if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            params = params.set(key, filters[key].toString());
            }
        }
        return this.http.get<any[]>(`${this.apiUrl}/products`, { params });
    }

    getProduct(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/products/${id}`);
    }

    // Review
    getReviewsByShop(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops/${id}/shop`);
    }

    getReviewsByProduct(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops/${id}/product`);
    }

    getReviewsByCustomer(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops/${id}/customer`);
    }

    // Reduction
    getReductionByProduct(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/reduction/${id}/product`);
    }

    getReductionByOffer(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/reduction/${id}/offer`);
    }
    
}