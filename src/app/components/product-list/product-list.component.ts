import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/general/cart-item';
import { Product } from 'src/app/general/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // add pagination properties
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {

      this.retrieveSearchProducts();
    }
    else {

      this.retrieveListProducts();
    }

  }

  retrieveSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    //error- reset ng page number to 1 when user searches different keyword than previous keyword searched
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }
  

  retrieveListProducts() {

    // check if an 'id' is in param map
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // retrieve 'id' string then convert string to number using the '+' symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // if no category id is in param map, default to category id equal to 1
      this.currentCategoryId = 1;
    }

    // error angular re-uses previous component state (id#) of product currently viewed
    // fix: reset ng component when user searches for different product category
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;  
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, this.thePageNumber=${this.thePageNumber}`);

    // (page# - 1) bc ng is 1 indexed while Spring Data REST is 0 indexed
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                               this.thePageSize, 
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());
  }

  // product object (imported) and pagination properties (declared atop this file) are 
  // assigned JSON values returned by REST (increment page num +1 bc angular:1-based tho rest:0-based)

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to Cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    // call by ProductListComponent 
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }

}
