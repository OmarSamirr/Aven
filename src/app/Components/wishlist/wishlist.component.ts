import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { WishlistService } from '../../Core/Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe } from '@angular/common';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { CartService } from '../../Core/Services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  wishlistProducts: WritableSignal<IProducts[]> = signal([]);

  getWishlistSub!: Subscription;
  deleteItemSub!: Subscription;
  addToCartSub!: Subscription;

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.getWishlistSub = this._WishlistService
      .getWishlistProducts()
      .subscribe({
        next: (res) => {
          this.wishlistProducts.set(res.data);
          this._WishlistService.wishlistNumber.set(res.data.length);
        },
      });
  }

  deleteItem(productId: string): void {
    this.deleteItemSub = this._WishlistService
      .deleteWishlistItem(productId)
      .subscribe({
        next: (res) => {
          this.getWishlist();
          if (res.status === 'success') {
            this._ToastrService.success(res.message, 'Aven');
          }
        },
      });
  }

  addToCart(productId: string): void {
    this.addToCartSub = this._CartService
      .addProductToCart(productId)
      .subscribe({
        next: (res) => {
          this._ToastrService.success(res.message, 'Aven');
          this._CartService.cartNumber.set(res.numOfCartItems);
          this.deleteItem(productId)
        },
      });
  }

  ngOnDestroy(): void {
    this.addToCartSub?.unsubscribe();
    this.deleteItemSub?.unsubscribe();
    this.getWishlistSub?.unsubscribe();
  }
}
