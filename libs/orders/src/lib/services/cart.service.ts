import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart';

export const CART_KEY = 'cart';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

    initCartLocalStorage() {
        const cart: Cart = this.getCart();
        if (!cart) {
            const initialCart = {
                items: []
            };

            const initialCartJSON = JSON.stringify(initialCart);

            localStorage.setItem(CART_KEY, initialCartJSON);
        }
    }

    emptyCart() {
        const initialCart = {
            items: []
        };

        const initialCartJSON = JSON.stringify(initialCart);

        localStorage.setItem(CART_KEY, initialCartJSON);

        this.cart$.next(initialCart);
    }

    getCart(): Cart {
        return JSON.parse(localStorage.getItem(CART_KEY) as string) as Cart;
    }

    setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
        const cart = this.getCart();
        const cartItemExist = cart.items?.find(
            (item) => item.productId === cartItem.productId
        );

        if (cartItemExist)
            cart.items?.map((item) => {
                if (
                    item.quantity &&
                    cartItem.quantity &&
                    item.productId === cartItem.productId
                ) {
                    if (updateCartItem) item.quantity = cartItem.quantity;
                    else item.quantity = item.quantity + cartItem.quantity;
                }
            });
        else cart.items?.push(cartItem);

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.cart$.next(cart);
        return cart;
    }

    deleteCartItem(productId: string) {
        const cart = this.getCart();
        const newCart = cart.items?.filter(
            (item) => item.productId !== productId
        );

        cart.items = newCart;

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        this.cart$.next(cart);
    }
}
