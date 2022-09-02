import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { CategoriesService, ProductsService } from '@ng-workspace/products';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { JwtInterceptor, UsersModule, UsersService } from '@ng-workspace/users';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { OrdersService } from '@ng-workspace/orders';

import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';
import { TagModule } from 'primeng/tag';
import { FieldsetModule } from 'primeng/fieldset';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxStripeModule } from 'ngx-stripe';

const UX_MODULE = [
    CardModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    ColorPickerModule,
    InputTextareaModule,
    InputSwitchModule,
    DropdownModule,
    EditorModule,
    InputMaskModule,
    TagModule,
    FieldsetModule
];

@NgModule({
    declarations: [
        AppComponent,
        NxWelcomeComponent,
        DashboardComponent,
        ShellComponent,
        SidebarComponent,
        CategoriesListComponent,
        CategoriesFormComponent,
        ProductsListComponent,
        ProductsFormComponent,
        UsersListComponent,
        UsersFormComponent,
        OrdersListComponent,
        OrdersDetailComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        UsersModule,
        AppRoutingModule,
        NgxStripeModule.forRoot(
            'pk_test_51KubgkSGdwofHk5EB7XZpSZVbSR36HV2LSt8XXLNtFe123koMYQgrEog4o5xDsaddiAu0daOUQPIgNnHdoyeduUl007uqXnwAf'
        ),
        ...UX_MODULE
    ],
    providers: [
        CategoriesService,
        MessageService,
        ConfirmationService,
        ProductsService,
        UsersService,
        OrdersService,
        { provide: DEFAULT_CURRENCY_CODE, useValue: 'INR' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
