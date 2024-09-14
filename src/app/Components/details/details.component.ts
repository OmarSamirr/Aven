import { Component, inject, OnDestroy, OnInit , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { CartService } from '../../Core/Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../Core/Services/wishlist.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CartService = inject(CartService);
  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);

  productDetails: IProducts | null = null;

  specificProductSubscription!: Subscription;

  ngOnInit(): void {
    this.specificProductSubscription = this._ActivatedRoute.data.subscribe({
      next: (resolvedData) => {
        this.productDetails = resolvedData['details']['data'];
      },
    });
  }

  addToCart(productId: string): void {
    this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'Fresh Cart');
        this._CartService.cartNumber.set(res.numOfCartItems);
      }
    });
  }

  addToWishlist(productId: string): void {
    this._WishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'Fresh Cart');
        this._WishlistService.wishlistNumber.set(res.data.length);
      },
    });
  }

  ngOnDestroy(): void {
    this.specificProductSubscription.unsubscribe();
  }
}
