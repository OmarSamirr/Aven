import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  constructor(private readonly _HttpClient: HttpClient) {}

  wishlistNumber: WritableSignal<number> = signal(0);

  addProductToWishlist(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/api/v1/wishlist`, {
      productId: productId,
    });
  }

  getWishlistProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/api/v1/wishlist`);
  }


  deleteWishlistItem(productId: string): Observable<any> {
    return this._HttpClient.delete(
      `${environment.baseURL}/api/v1/wishlist/${productId}`
    );
  }

}
