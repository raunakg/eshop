import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@ng-workspace/orders';
import { ProductsService } from '@ng-workspace/products';
import { UsersService } from '@ng-workspace/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    statistics = [];
    endSub$: Subject<any> = new Subject();

    constructor(
        private us: UsersService,
        private ps: ProductsService,
        private os: OrdersService
    ) {}

    ngOnInit(): void {
        combineLatest([
            this.os.getOrdersCount(),
            this.ps.getProductsCount(),
            this.us.getUsersCount(),
            this.os.getTotalSales()
        ])
            .pipe(takeUntil(this.endSub$))
            .subscribe((values) => (this.statistics = values));
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }
}
