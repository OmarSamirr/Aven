import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly _HttpClient = inject(HttpClient);

  getProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/api/v1/products`);
  }
  getSpecificProduct(id:string | null): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/api/v1/products/${id}`);
  }
}
