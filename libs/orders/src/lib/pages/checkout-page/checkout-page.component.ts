import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@ng-workspace/users';
import { StripeService } from 'ngx-stripe';
import { Subject, takeUntil } from 'rxjs';
import { Cart } from '../../models/cart';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'orders-checkout-page',
    templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
    constructor(
        private router: Router,
        private usersService: UsersService,
        private formBuilder: FormBuilder,
        private cartService: CartService,
        private os: OrdersService,
        private stripeService: StripeService
    ) {}
    checkoutFormGroup!: FormGroup;
    isSubmitted = false;
    orderItems: OrderItem[] = [];
    userId!: string;
    countries: any[] = [];
    endSub$: Subject<any> = new Subject();

    ngOnInit(): void {
        this._initCheckoutForm();
        this._autoFillUserData();
        this._getCartItems();
        this._getCountries();
    }

    ngOnDestroy(): void {
        this.endSub$.next(true);
        this.endSub$.complete();
    }

    private _initCheckoutForm() {
        this.checkoutFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.email, Validators.required]],
            phone: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            zip: ['', Validators.required],
            apartment: ['', Validators.required],
            street: ['', Validators.required]
        });
    }

    private _autoFillUserData() {
        this.usersService
            .observeCurrentUser()
            .pipe(takeUntil(this.endSub$))
            .subscribe((user) => {
                if (user) {
                    this.userId = user.id as string;
                    this.checkoutForm['name'].setValue(user.name);
                    this.checkoutForm['email'].setValue(user.email);
                    this.checkoutForm['phone'].setValue(user.phone);
                    this.checkoutForm['city'].setValue(user.city);
                    this.checkoutForm['country'].setValue(user.country);
                    this.checkoutForm['zip'].setValue(user.zip);
                    this.checkoutForm['apartment'].setValue(user.apartment);
                    this.checkoutForm['street'].setValue(user.street);
                }
            });
    }

    private _getCartItems() {
        const cart: Cart = this.cartService.getCart();
        if (cart && cart.items) {
            this.orderItems = cart.items.map((item) => {
                return {
                    product: item.productId,
                    quantity: item.quantity
                };
            });
        }
    }

    private _getCountries() {
        this.countries = this.usersService.getCountries();
    }

    backToCart() {
        this.router.navigate(['/cart']);
    }

    placeOrder() {
        this.isSubmitted = true;
        if (this.checkoutFormGroup.invalid) {
            return;
        }

        const order: Order = {
            orderItems: this.orderItems,
            shippingAddress1: this.checkoutForm['street'].value,
            shippingAddress2: this.checkoutForm['apartment'].value,
            city: this.checkoutForm['city'].value,
            zip: this.checkoutForm['zip'].value,
            country: this.checkoutForm['country'].value,
            phone: this.checkoutForm['phone'].value,
            user: this.userId,
            dateOrdered: `${Date.now()}`
        };

        this.os.cacheOrderData(order);
        this.os.createCheckoutSession(this.orderItems).subscribe((error) => {
            if (error) {
                console.log('errorin redirect to payment');
            }
        });
    }

    get checkoutForm() {
        return this.checkoutFormGroup.controls;
    }
}
