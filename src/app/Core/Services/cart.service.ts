import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private readonly _HttpClient: HttpClient) {}

  cartNumber: WritableSignal<number> = signal(0);

  addProductToCart(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/api/v1/cart`, {
      productId: productId,
    });
  }

  getCartProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/api/v1/cart`);
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(`${environment.baseURL}/api/v1/cart`);
  }

  deleteCartItem(productId: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.baseURL}/api/v1/cart/${productId}`
    );
  }

  updateItemQuantity(productId: string, newCount: number): Observable<any> {
    return this._HttpClient.put(
      `${environment.baseURL}/api/v1/cart/${productId}`,
      {
        count: newCount,
      }
    );
  }
}
