import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurchaseDetails } from '../general/purchase-details';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  private purchaseDetailsUrl = environment.boltEbikesApiUrl + '/checkout/purchase-details';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchaseDetails: PurchaseDetails): Observable<any> {
    return this.httpClient.post<PurchaseDetails>(this.purchaseDetailsUrl, purchaseDetails);
  }
}
