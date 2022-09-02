import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-thank-you',
    templateUrl: './thank-you.component.html',
    styles: []
})
export class ThankYouComponent implements OnInit {
    constructor(private os: OrdersService, private cartService: CartService) {}

    ngOnInit(): void {
        const orderData = this.os.getCachedOrderData();
        this.os
            .createOrder(orderData)
            .pipe()
            .subscribe(
                () => {
                    this.cartService.emptyCart();
                    this.os.removeCachedOrderData();
                },
                () => {
                    // error
                }
            );
    }
}
