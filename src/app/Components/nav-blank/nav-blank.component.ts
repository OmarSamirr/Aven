import { Component, computed, inject, OnInit, Signal, WritableSignal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthenticationService } from '../../Core/Services/authentication.service';
import { FlowbiteService } from '../../Core/Services/flowbite.service';
import { MytranslationService } from '../../Core/Services/mytranslation.service';
import { CartService } from '../../Core/Services/cart.service';
import { WishlistService } from '../../Core/Services/wishlist.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss',
})
export class NavBlankComponent implements OnInit {
  constructor(private _FlowbiteService: FlowbiteService) {}
  readonly _AuthenticationService = inject(AuthenticationService);
  readonly _MytranslationService = inject(MytranslationService);
  readonly _CartService = inject(CartService);
  readonly _WishlistService = inject(WishlistService);

  cartCount: Signal<number> = computed(()=> this._CartService.cartNumber());
  wishlistCount: Signal<number> = computed(()=> this._WishlistService.wishlistNumber());

  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite((flowbite) => {});
    this._CartService.getCartProducts().subscribe({
      next: (res) => {
        this._CartService.cartNumber.set(res.numOfCartItems);
      },
    });
  }

  switchLanguage(lang: string): void {
    this._MytranslationService.setLanguage(lang);
    this._MytranslationService.useLanguage();
  }
}
