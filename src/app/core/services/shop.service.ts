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

    // Shop Info
    getInfo(id: String): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/shops/${id}`);
    }

    updateInfo(id: String, offerData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/shops/${id}`, offerData);
    }

    // Offers
    getAllActiveOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offers/shop/active`);
    }

    getAllPendingOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offers/shop/pending`);
    }

    getAllHistoricOffers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/offers/shop/historic`);
    }

    createOffer(offerData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/offers`, offerData);
    }

    updateOffer(id: string, offerData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/offers/${id}`, offerData);
    }

    deleteOffer(id: string, offerData: any): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/offers/${id}`, offerData);
    }

    // Products
    getFilteredProducts(filters: { [key: string]: any }): Observable<any[]> {
        let params = new HttpParams();

        for (const key in filters) {
            if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
            params = params.set(key, filters[key].toString());
            }
        }

        return this.http.get<any[]>(`${this.apiUrl}/products/`, { params });
    }
}