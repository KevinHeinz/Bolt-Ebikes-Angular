import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/general/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {

    this.processOrderHistory();
  }

  processOrderHistory() {
    
    // get email value from session storage key
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));

    // get order history from service by passing userEmail value
    this.orderHistoryService.getOrderHistory(theEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    );
  }

}
