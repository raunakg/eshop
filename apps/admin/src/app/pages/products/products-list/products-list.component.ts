import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@ng-workspace/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styles: []
})
export class ProductsListComponent implements OnInit {
    products = [];
    constructor(
        private router: Router,
        private productsService: ProductsService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this._getProducts();
    }

    private _getProducts() {
        this.productsService
            .getProducts()
            .subscribe((products) => (this.products = products));
    }

    updateProduct(productId: string) {
        this.router.navigateByUrl(`products/form/${productId}`);
    }

    deleteProduct(productId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.productsService.deleteProduct(productId).subscribe(
                    () => {
                        this._getProducts();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Product is deleted!'
                        });
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Product is not deleted!'
                        });
                    }
                );
            }
        });
    }
}
