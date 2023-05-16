import { CartItem } from "./cart-item";

export class OrderItem {

    imageUrl: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    
    constructor(cartItem: CartItem) {

        this.imageUrl = cartItem.imageUrl;
        this.productId = cartItem.id;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
    }
}

