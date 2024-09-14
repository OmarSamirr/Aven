import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../Core/Services/cart.service';
import { CategoriesService } from '../../Core/Services/categories.service';
import { ProductsService } from '../../Core/Services/products.service';
import { Subscription } from 'rxjs';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { SearchPipe } from '../../Core/Pipes/search.pipe';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../Core/Services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TranslateModule, FormsModule, SearchPipe, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);

  productsList: WritableSignal<IProducts[]> = signal([]);
  wishlistProductsList: WritableSignal<IProducts[]> = signal([]);

  getAllProductsSubscription!: Subscription;
  deleteItemSub!: Subscription;
  getWishlistSub!: Subscription;
  addToWishlistSub!: Subscription;
  term: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getWishlist();

    this.getAllProductsSubscription = this._ProductsService
      .getProducts()
      .subscribe({
        next: (res) => {
          this.productsList.set(res.data);
          this.productsList().forEach((product) => {
            //for each item , add star rating value to property for stars in card
            product.ratingDecimal = (product.ratingsAverage % 1) * 100;
            this.wishlistProductsList().forEach((item) => {
              //check if item is present in wishlist, keep heart icon red
              if (item.id === product.id) {
                product.isInWishlist = true;
              }
            });
          });
        },
      });
  }

  addToCart(productId: string): void {
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'Aven');
        this._CartService.cartNumber.set(res.numOfCartItems);
      },
    });
  }

  getWishlist(): void {
    this.getWishlistSub = this._WishlistService
      .getWishlistProducts()
      .subscribe({
        next: (res) => {
          this.wishlistProductsList.set(res.data);
          this._WishlistService.wishlistNumber.set(res.data.length);
        },
      });
  }

  toggleWishlist(productId: string, isInWishlist: boolean): void {
    if (!isInWishlist) {
      this.addToWishlist(productId);
    } else {
      this.deleteFromWishlist(productId);
    }
  }

  addToWishlist(productId: string): void {
    this.addToWishlistSub = this._WishlistService
      .addProductToWishlist(productId)
      .subscribe({
        next: (res) => {
          this._ToastrService.success(res.message, 'Aven');
          this._WishlistService.wishlistNumber.set(res.data.length);
          this.productsList().forEach((product) => {
            if (productId === product.id) {
              product.isInWishlist = true;
            }
          });
        },
      });
  }

  deleteFromWishlist(productId: string): void {
    this.deleteItemSub = this._WishlistService
      .deleteWishlistItem(productId)
      .subscribe({
        next: (res) => {
          this._WishlistService.wishlistNumber.set(res.data.length);
          if (res.status === 'success') {
            this._ToastrService.success(res.message, 'Aven');
          }
          this.productsList().forEach((product) => {
            if (productId === product.id) {
              product.isInWishlist = false;
            }
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.getAllProductsSubscription?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
    this.getWishlistSub?.unsubscribe();
    this.deleteItemSub?.unsubscribe();
  }
}
