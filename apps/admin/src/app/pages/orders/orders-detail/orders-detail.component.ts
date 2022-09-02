import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@ng-workspace/orders';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styles: []
})
export class OrdersDetailComponent implements OnInit {
    order: Order;
    orderStatuses = [];
    selectedOrderStatus: any;

    constructor(
        private os: OrdersService,
        private route: ActivatedRoute,
        private ms: MessageService
    ) {}

    ngOnInit(): void {
        this._mapOrderStatus();
        this._getOrder();
    }

    private _getOrder() {
        this.route.params.subscribe((params) => {
            if (params.id) {
                this.os.getOrder(params.id).subscribe((order) => {
                    this.order = order;
                    this.selectedOrderStatus = order.status;
                });
            }
        });
    }

    private _mapOrderStatus() {
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
            return {
                id: key,
                name: ORDER_STATUS[key].label
            };
        });
    }

    onStatusChange(event) {
        this.os.updateOrder({ status: event.value }, this.order.id).subscribe(
            () => {
                this.ms.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order is updated'
                });
            },
            () => {
                this.ms.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Order is not updated'
                });
            }
        );
    }
}
