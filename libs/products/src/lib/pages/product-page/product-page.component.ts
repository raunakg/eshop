import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem, CartService } from '@ng-workspace/orders';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-page.component.html',
    styles: []
})
export class ProductPageComponent implements OnInit, OnDestroy {
    product: Product = new Product();
    endSub$: Subject<any> = new Subject();
    quantity = 1;

    constructor(
        private ps: ProductsService,
        private route: ActivatedRoute,
        private cartService: CartService
    ) {}

    ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.endSub$)).subscribe((params) => {
            if (params['productId']) {
                this._getProduct(params['productId']);
            }
        });
    }

    private _getProduct(productId: string) {
        this.ps
            .getProduct(productId)
            .pipe(takeUntil(this.endSub$))
            .subscribe((product) => (this.product = product));
    }

    addProductToCart() {
        const cartItem: CartItem = {
            productId: this.product.id,
            quantity: this.quantity
        };
        this.cartService.setCartItem(cartItem);
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }
}
