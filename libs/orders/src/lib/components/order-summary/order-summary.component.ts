import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-order-summary',
    templateUrl: './order-summary.component.html',
    styles: []
})
export class OrderSummaryComponent implements OnInit, OnDestroy {
    endSub$: Subject<any> = new Subject();
    totalPrice = 0;
    isCheckout = false;

    constructor(
        private cartService: CartService,
        private orderService: OrdersService,
        private router: Router
    ) {
        this.router.url.includes('checkout')
            ? (this.isCheckout = true)
            : (this.isCheckout = false);
    }

    ngOnInit(): void {
        this._getOrderSummary();
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }

    navigateToCheckout() {
        this.router.navigate(['/checkout']);
    }

    _getOrderSummary() {
        this.cartService.cart$
            .pipe(takeUntil(this.endSub$))
            .subscribe((cart) => {
                this.totalPrice = 0;
                cart &&
                    cart.items?.map(
                        (item) =>
                            item &&
                            item.productId &&
                            this.orderService
                                .getProduct(item.productId)
                                .pipe(take(1))
                                .subscribe(
                                    (product) =>
                                        item.quantity &&
                                        (this.totalPrice +=
                                            product.price * item.quantity)
                                )
                    );
            });
    }
}
