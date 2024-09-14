import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private readonly _HttpClient: HttpClient) {}

  createCheckoutSession(cartId: string|null, orderDetails: any): Observable<any> {
    return this._HttpClient.post(
      `${environment.baseURL}/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`,
      {
        shippingAddress: orderDetails,
      });
  }
  getAllUserOrders(userId: string|null): Observable<any> {
    return this._HttpClient.get(
      `${environment.baseURL}/api/v1/orders/user/${userId}`);
  }
}
