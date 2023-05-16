import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class PurchaseDetails {

    customer: Customer;
    billingAddress: Address;
    shippingAddress: Address;
    order: Order;
    orderItems: OrderItem[];
}
