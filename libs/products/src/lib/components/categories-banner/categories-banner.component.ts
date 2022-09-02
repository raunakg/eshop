import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';

@Component({
    selector: 'products-categories-banner',
    templateUrl: './categories-banner.component.html',
    styles: []
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    endSub$: Subject<any> = new Subject();

    constructor(private cs: CategoriesService) {}

    ngOnInit(): void {
        this._getCategories();
    }

    private _getCategories() {
        this.cs
            .getCategories()
            .pipe(takeUntil(this.endSub$))
            .subscribe((cat) => (this.categories = cat));
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }
}
