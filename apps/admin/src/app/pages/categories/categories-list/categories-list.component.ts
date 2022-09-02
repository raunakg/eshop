import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@ng-workspace/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html',
    styles: []
})
export class CategoriesListComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    endsubs$: Subject<any> = new Subject();

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private categoriesService: CategoriesService
    ) {}

    ngOnInit(): void {
        this._getCategories();
    }

    deleteCategory(categoryId: string) {
        this.confirmationService.confirm({
            message: 'Do you want to delte this category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.categoriesService.deleteCategory(categoryId).subscribe(
                    () => {
                        this._getCategories();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Category is deleted'
                        });
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Category is not deleted'
                        });
                    }
                );
            }
        });
    }

    updateCategory(categoryId: string) {
        this.router.navigateByUrl(`categories/form/${categoryId}`);
    }

    private _getCategories() {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((cats) => {
                this.categories = cats;
            });
    }

    ngOnDestroy(): void {
        this.endsubs$.next(true);
        this.endsubs$.complete();
    }
}
