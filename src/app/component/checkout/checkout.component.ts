import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/general/country';
import { Order } from 'src/app/general/order';
import { OrderItem } from 'src/app/general/order-item';
import { PurchaseDetails } from 'src/app/general/purchase-details';
import { State } from 'src/app/general/state';
import { CartService } from 'src/app/services/cart.service';
import { EbikesFormService } from 'src/app/services/ebikes-form.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { BoltFormValidators } from 'src/app/validators/bolt-form-validators';

/* File Section Guide                                                                                               */
/*      Top Section: [Declarations]                                                                                 */
/*            ngOnInit() [CheckoutFormGroup, FormBuilder Section]                                                   */
/*                  ReviewCartDetails()                                                                             */
/*                      Getters()                                                                                   */
/*                           copyAddress()  [Address copy from Shipping to Billing]                                 */
/*                                  onComplete() [submits form for: customer, Address(es), and payment]             */
/*                                       updateExpiryMonths() [form cc payment section]                             */
/*                                               Bottom Section: getStates()[form Address(es)]                      */


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  /*    Top Section: Begin [Declarations]                                                                          */

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  ccMonths: number[] = [];
  ccYears: number[] = [];

  countries: Country[] = [];
  
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

  constructor(private formBuilder: FormBuilder,
              private ebikesFormService: EbikesFormService,
              private cartService: CartService,
              private purchaseService: PurchaseService,
              private router: Router) { }

  /*              End Declarations                                                                                 */

  /*                  Begin CheckoutFormGroup, FormBuilder                                                         */

  ngOnInit(): void {

    this.reviewCartDetails();

    // get email address from session storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        email: new FormControl(theEmail,[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        cardName: new FormControl('', [Validators.required, Validators.minLength(2), BoltFormValidators.invalidSpaceChars]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expiryMonth: [''],
        expiryYear: ['']
      })
    });

    // error-- ng:1-indexed while js:0-indexed, fix by add +1 month 

    const fromMonth: number = new Date().getMonth() + 1;
    console.log("DevLog fromMonth passed as: " + fromMonth);

    this.ebikesFormService.getCcMonths(fromMonth).subscribe(
      data => {
        console.log("DevLog: cc months passed as: " + JSON.stringify(data));
        this.ccMonths = data;
      }
    );

    this.ebikesFormService.getCcYears().subscribe(
      data => {
        console.log("DevLog: cc year passed as: " + JSON.stringify(data));
        this.ccYears = data;
      }
    );

    // initialize countries when form displayed 
    this.ebikesFormService.getCountries().subscribe(
      data => {
        console.log("DevLog: countries from Db passed as: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  /*                  End CheckoutFormGroup, FormBuilder                                                           */

  /*                       Begin reviewCartDetails()                                                               */
  reviewCartDetails() {
    
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  /*                             End reviewCartDetails()                                                          */

  /*                                 Begin Getters                                                                */

  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }
  
  get shippingAddressStreet() { 
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() { 
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() { 
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() { 
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() { 
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  get billingAddressStreet() { 
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() { 
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() { 
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() { 
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() { 
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  get ccType() { 
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get ccName() { 
    return this.checkoutFormGroup.get('creditCard.cardName');
  }
  get ccNumber() { 
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get ccSecCode() { 
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }

  /*                                       End Getters                                                            */

  /*                                          Begin copyAddress(event)                                            */

  copyAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }

  }
   /*                                                End copyAddress(event)                                     */

   /*                                                   Begin onComplete()                                      */

  onComplete() {
    console.log("DevLog: Processing Customer onClick 'Complete' button... ");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // initialize order object
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // put cartItems into orderItems[]
    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // put customer, Ship/Bill addresses, order, orderItems into purchaseDetails
    let purchaseDetails = new PurchaseDetails;

    purchaseDetails.customer = this.checkoutFormGroup.controls['customer'].value;

    purchaseDetails.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchaseDetails.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchaseDetails.shippingAddress.country));
    purchaseDetails.shippingAddress.state = shippingState.name;
    purchaseDetails.shippingAddress.country = shippingCountry.name;

    purchaseDetails.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchaseDetails.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchaseDetails.billingAddress.country));
    purchaseDetails.billingAddress.state = billingState.name;
    purchaseDetails.billingAddress.country = billingCountry.name;

    purchaseDetails.order = order;
    purchaseDetails.orderItems = orderItems;

    // call rest api via PurchaseService
    this.purchaseService.placeOrder(purchaseDetails).subscribe({

        next: response => {
          alert(`Your Bolt Ebikes order has been received!\n
                  Please note your order tracking number: ${response.trackingNumber}`)

                  // reset shopping cart
                  this.resetCart();
        },
        error: err => {
          alert(`We're currently experiencing an error, sorry: ${err.message}`);
        }
      }
    );

    console.log("DevLog: Customer obj value passed as: " + this.checkoutFormGroup.get('customer').value);
    console.log("DevLog: email value passed as: " + this.checkoutFormGroup.get('customer').value.email);
    console.log("DevLog: shipping country passed as: " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("DevLog: shipping state passed as: " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();
    
    this.router.navigateByUrl("/products");
  }
  /*                                                         End onComplete()                                   */

  /*                                                             Begin updateExpiryMonths()                     */

  updateExpiryMonths() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expiryYear);

    let fromMonth: number;

    if (currentYear === selectedYear) {
      fromMonth = new Date().getMonth() + 1;
    }
    else {
      fromMonth = 1;
    }

    this.ebikesFormService.getCcMonths(fromMonth).subscribe(
      data => {
        console.log("DevLog: cc months passed as: " + JSON.stringify(data));
        this.ccMonths = data;
      }
    );
  }
   /*                                                            End updateExpiryMonths()                      */

   /*                                                                 Begin getStates(formGroupName)           */

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    // error: const countryName only use for logging/debugging
    const countryName = formGroup.value.country.name;

    console.log(`DevLog: ${formGroupName} country code passed as: ${countryCode}`);
    console.log(`DevLog: ${formGroupName} country name passed as: ${countryName}`);

    this.ebikesFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // default display first state
        formGroup.get('state').setValue(data[0]);
      }

    );
  }
   /*                                                                        End getStates(formGroupName)      */
}