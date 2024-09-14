import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  WritableSignal,
  signal,
} from '@angular/core';
import { ProductsService } from '../../Core/Services/products.service';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../Core/Services/categories.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { ICategories } from '../../Core/Interfaces/icategories';
import { RouterLink } from '@angular/router';
import { SearchPipe } from '../../Core/Pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../Core/Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { WishlistService } from '../../Core/Services/wishlist.service';
import { WishlistComponent } from '../wishlist/wishlist.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CarouselModule,
    RouterLink,
    SearchPipe,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);

  productsList: WritableSignal<IProducts[]> = signal([]);
  categoriesList: WritableSignal<ICategories[]> = signal([]);
  wishlistProductsList: WritableSignal<IProducts[]> = signal([]);
  getAllProductsSubscription!: Subscription;
  getAllCategoriesSubscription!: Subscription;
  addToCartSub!: Subscription;
  deleteItemSub!: Subscription;
  getWishlistSub!: Subscription;
  addToWishlistSub!: Subscription;
  term: WritableSignal<string> = signal('');
  direction: WritableSignal<string> = signal(localStorage.getItem('dir')!);

  catCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: [
      '<i class="fa-solid fa-right-long"></i>',
      '<i class="fa-solid fa-left-long"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };

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
            this.wishlistProductsList().forEach((item)=>{
              //check if item is present in wishlist, keep heart icon red
              if (item.id === product.id) {
                product.isInWishlist = true;
              }
            });
          });
        },
      });

    this.getAllCategoriesSubscription = this._CategoriesService
      .getCategories()
      .subscribe({
        next: (res) => {
          this.categoriesList.set(res.data);
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
    this.getAllCategoriesSubscription?.unsubscribe();
    this.addToCartSub?.unsubscribe();
    this.addToWishlistSub?.unsubscribe();
    this.getWishlistSub?.unsubscribe();
    this.deleteItemSub?.unsubscribe();
  }
}
