import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItemsDetailed } from '../../models/cart';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-cart-page',
    templateUrl: './cart-page.component.html',
    styles: []
})
export class CartPageComponent implements OnInit, OnDestroy {
    cartItemsDetailed: CartItemsDetailed[] = [];
    cartCount = 0;
    endSub$: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private cartService: CartService,
        private orderService: OrdersService
    ) {}

    ngOnInit(): void {
        this._getCartDetails();
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }

    private _getCartDetails() {
        this.cartService.cart$
            .pipe(takeUntil(this.endSub$))
            .subscribe((resCart) => {
                this.cartItemsDetailed = [];
                this.cartCount = resCart?.items?.length ?? 0;
                resCart.items?.forEach((item) => {
                    item.productId &&
                        this.orderService
                            .getProduct(item.productId)
                            .pipe()
                            .subscribe((product) =>
                                this.cartItemsDetailed.push({
                                    product,
                                    quantity: item.quantity
                                })
                            );
                });
            });
    }

    updateCartItemQuantity(event: { value: any }, cartItem: CartItemsDetailed) {
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: event.value
            },
            true
        );
    }

    backToShop() {
        this.router.navigate(['/products']);
    }

    deleteCart(cartItem: CartItemsDetailed) {
        this.cartService.deleteCartItem(cartItem.product.id);
    }
}
