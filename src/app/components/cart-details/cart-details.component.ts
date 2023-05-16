import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/general/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // call from cart-items.ts
    this.cartItems = this.cartService.cartItems;

    // subscribe to cart service totals' update
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    
    // update cart details list
    this.cartService.updateCartTotals();
  }

  increaseQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decreaseQuantity(theCartItem: CartItem) {
    this.cartService.decreaseQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }

}
