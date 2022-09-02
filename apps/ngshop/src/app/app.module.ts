import { DEFAULT_CURRENCY_CODE, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@ng-workspace/ui';
import { NavComponent } from './shared/nav/nav.component';
import { ProductsModule } from '@ng-workspace/products';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrdersModule } from '@ng-workspace/orders';
import { MessagesComponent } from './shared/messages/messages.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { JwtInterceptor, UsersModule } from '@ng-workspace/users';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgxStripeModule } from 'ngx-stripe';

const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    }
];

@NgModule({
    declarations: [
        AppComponent,
        NxWelcomeComponent,
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        NavComponent,
        MessagesComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        UiModule,
        BrowserAnimationsModule,
        ProductsModule,
        OrdersModule,
        ToastModule,
        UsersModule,
        RouterModule.forRoot(routes),
        NgxStripeModule.forRoot(
            'pk_test_51KubgkSGdwofHk5EB7XZpSZVbSR36HV2LSt8XXLNtFe123koMYQgrEog4o5xDsaddiAu0daOUQPIgNnHdoyeduUl007uqXnwAf'
        )
    ],
    providers: [
        MessageService,
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
