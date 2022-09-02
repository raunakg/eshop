import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@ng-workspace/orders';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styles: []
})
export class OrdersListComponent implements OnInit {
    orders: Order[] = [];
    orderStatus = ORDER_STATUS;

    constructor(
        private os: OrdersService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getOrders();
    }

    private _getOrders() {
        this.os.getOrders().subscribe((orders) => (this.orders = orders));
    }

    showOrder(orderId: string) {
        this.router.navigateByUrl(`orders/${orderId}`);
    }

    deleteOrder(orderId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to Delete this Order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.os.deleteOrder(orderId).subscribe(
                    () => {
                        this._getOrders();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Order is deleted!'
                        });
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Order is not deleted!'
                        });
                    }
                );
            }
        });
    }
}
