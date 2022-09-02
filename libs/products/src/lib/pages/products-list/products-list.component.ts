import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { CategoriesService } from '../../services/categories.service';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-list-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    categories: Category[] = [];
    isCategoryPage = false;
    endSub$: Subject<any> = new Subject();

    constructor(
        private ps: ProductsService,
        private cs: CategoriesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            if (params['categoryId']) {
                this.isCategoryPage = true;
                this._getProducts([params['categoryId']]);
            } else {
                this.isCategoryPage = false;
                this._getProducts();
            }
        });

        this._getCategories();
    }

    private _getProducts(categoriesFilter?: (string | undefined)[]) {
        this.ps
            .getProducts(categoriesFilter)
            .pipe(takeUntil(this.endSub$))
            .subscribe((products) => (this.products = products));
    }

    private _getCategories() {
        this.cs
            .getCategories()
            .pipe(takeUntil(this.endSub$))
            .subscribe((categories) => (this.categories = categories));
    }

    categoryFilter() {
        const selectedCategories = this.categories
            .filter((category) => category.checked)
            .map((category) => category.id);

        this._getProducts(selectedCategories);
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }
}
