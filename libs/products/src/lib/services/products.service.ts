import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Product } from '../models/product';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    apiURLProducts = environment.apiURL + 'products';
    constructor(private http: HttpClient) {}

    getProducts(
        categoriesFilter?: (string | undefined)[]
    ): Observable<Product[]> {
        let params = new HttpParams();
        if (categoriesFilter) {
            params = params.append('categories', categoriesFilter.join(','));
        }
        return this.http.get<Product[]>(this.apiURLProducts, { params });
    }

    getProduct(productId: string): Observable<Product> {
        return this.http.get<Product>(this.apiURLProducts + '/' + productId);
    }

    createProduct(productData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiURLProducts, productData);
    }

    updateProduct(
        productData: FormData,
        productId: string
    ): Observable<Product> {
        return this.http.put<Product>(
            this.apiURLProducts + '/' + productId,
            productData
        );
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
    }

    getProductsCount(): Observable<{ productCount: number }> {
        return this.http
            .get<{ productCount: number }>(`${this.apiURLProducts}/get/count`)
            .pipe();
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(
            `${this.apiURLProducts}/get/featured/${count}`
        );
    }
}
