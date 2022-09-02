import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@ng-workspace/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styles: []
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
    form: FormGroup;
    isSubmitted = false;
    editmode = false;
    currentCategoryId: string;
    endSub$: Subject<any> = new Subject();

    constructor(
        private location: Location,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            color: ['#fff']
        });

        this._checkEditMode();
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }
        const category: Category = {
            id: this.currentCategoryId,
            name: this.categoryForm.name.value,
            icon: this.categoryForm.icon.value,
            color: this.categoryForm.color.value
        };
        if (this.editmode) {
            this._updateCategory(category);
        } else {
            this._addCategory(category);
        }
    }

    private _addCategory(category: Category) {
        this.categoriesService
            .createCategory(category)
            .pipe(takeUntil(this.endSub$))
            .subscribe(
                (category: Category) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category ${category.name} is created`
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },

                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is not created'
                    });
                }
            );
    }

    private _updateCategory(category: Category) {
        this.categoriesService
            .updateCategory(category)
            .pipe(takeUntil(this.endSub$))
            .subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category is updated'
                    });
                    timer(2000)
                        .toPromise()
                        .then(() => {
                            this.location.back();
                        });
                },

                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is not updated'
                    });
                }
            );
    }

    private _checkEditMode() {
        this.route.params.pipe(takeUntil(this.endSub$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentCategoryId = params.id;
                this.categoriesService
                    .getCategory(params.id)
                    .pipe(takeUntil(this.endSub$))
                    .subscribe((category) => {
                        this.categoryForm.name.setValue(category.name);
                        this.categoryForm.icon.setValue(category.icon);
                        this.categoryForm.color.setValue(category.color);
                    });
            }
        });
    }

    get categoryForm() {
        return this.form.controls;
    }

    onCancel() {
        this.location.back();
    }
}
