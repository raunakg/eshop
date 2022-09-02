import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-featured-products',
    templateUrl: './featured-products.component.html',
    styles: []
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    endSub$: Subject<any> = new Subject();

    constructor(private ps: ProductsService) {}

    ngOnInit(): void {
        this._getFeaturedProducts();
    }

    private _getFeaturedProducts() {
        this.ps
            .getFeaturedProducts(4)
            .pipe(takeUntil(this.endSub$))
            .subscribe((products) => (this.products = products));
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }
}
