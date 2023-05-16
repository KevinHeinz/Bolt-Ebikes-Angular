import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../general/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() { 
    // get cart item JSON data from session storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null) {
      this.cartItems = data;
      // update cart totals
      this.updateCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    // check boolean if cart has item
    let confirmedInCart: boolean = false;
    let itemConfirmedInCart: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // search cart item by id#
      itemConfirmedInCart = this.cartItems.find( tempItem => tempItem.id === theCartItem.id );

      // confirm item search result
      confirmedInCart = (itemConfirmedInCart != undefined);
    }

    if (confirmedInCart) {
      // cart item count
      itemConfirmedInCart.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    // update cart item count and price
    this.updateCartTotals();
  }
  updateCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // send new cart status totals resulting from cart service item update
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // display dev console 
    this.logCartValues(totalPriceValue, totalQuantityValue);

    // storage data persistence (cartItems)
    // sessionStorage(persists refresh/login)/localStorage(persists browser close)]
    this.persistCartItems();

  }

  persistCartItems() {

    // Api key/value pairs
    // JSON data-> key: cartItems, (JSON stringified) value:cartItems in(this.cartItems)
    //                       |                               |
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartValues(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log(`Updated Cart Totals: `);
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-     -  -  -  -   -     -')
  }

  decreaseQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.updateCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // retrieve item's array index
    const itemIndex = this.cartItems.findIndex( tempItem => tempItem.id === theCartItem.id );

    // remove array index item if found
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.updateCartTotals();
    }
  }

}
