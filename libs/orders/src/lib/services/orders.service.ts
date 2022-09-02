import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order';
import { Observable, switchMap } from 'rxjs';
import { environment } from '@env/environment';
import { OrderItem } from '../models/order-item';
import { StripeService } from 'ngx-stripe';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {
    apiURLOrders = environment.apiURL + 'orders';
    apiURLProducts = environment.apiURL + 'products';

    constructor(
        private http: HttpClient,
        private stripeService: StripeService
    ) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiURLOrders);
    }

    getOrder(orderId: string): Observable<Order> {
        return this.http.get<Order>(this.apiURLOrders + '/' + orderId);
    }

    createOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiURLOrders, order);
    }

    updateOrder(
        orderStatus: { status: string },
        orderId: string
    ): Observable<Order> {
        return this.http.put<Order>(
            this.apiURLOrders + '/' + orderId,
            orderStatus
        );
    }

    deleteOrder(orderId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
    }

    getOrdersCount(): Observable<{ orderCount: number }> {
        return this.http
            .get<{ orderCount: number }>(`${this.apiURLOrders}/get/count`)
            .pipe();
    }

    getTotalSales(): Observable<{ totalsales: number }> {
        return this.http
            .get<{ totalsales: number }>(`${this.apiURLOrders}/get/totalsales`)
            .pipe();
    }

    getProduct(productId: string): Observable<any> {
        return this.http.get<any>(this.apiURLProducts + '/' + productId);
    }

    createCheckoutSession(orderItems: OrderItem[]) {
        return this.http
            .post(`${this.apiURLOrders}/create-checkout-session`, orderItems)
            .pipe(
                switchMap((session: any) => {
                    return this.stripeService.redirectToCheckout({
                        sessionId: session.id
                    });
                })
            );
    }

    cacheOrderData(order: Order) {
        localStorage.setItem('orderData', JSON.stringify(order));
    }

    getCachedOrderData(): Order {
        return JSON.parse(localStorage.getItem('orderData') as string);
    }

    removeCachedOrderData() {
        localStorage.removeItem('orderData');
    }
}
