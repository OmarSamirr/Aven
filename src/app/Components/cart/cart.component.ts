import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../Core/Services/cart.service';
import { ICart } from '../../Core/Interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, SweetAlert2Module, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);

  cartProducts: ICart = {} as ICart;

  ngOnInit(): void {
    this._CartService.getCartProducts().subscribe({
      next: (res) => {
        this.cartProducts = res.data;
      },
    });
  }

  clearCart(): void {
    this._CartService.clearCart().subscribe({
      next: (res) => {
        this.cartProducts = {} as ICart;
        this._CartService.cartNumber.set(0);
      },
    });
  }

  deleteItem(productId: string): void {
    this._CartService.deleteCartItem(productId).subscribe({
      next: (res) => {
        this.cartProducts = res.data;
        if (res.status === 'success') {
          this._ToastrService.success('Item Removed Successfully', 'Aven');
        }
        this._CartService.cartNumber.set(res.numOfCartItems);
      },
    });
  }

  updateQuantity(productId: string, newCount: number): void {
    this._CartService.updateItemQuantity(productId, newCount).subscribe({
      next: (res) => {
        this.cartProducts = res.data;
        if (res.status === 'success') {
          this._ToastrService.success('Quantity Successfully Updated', 'Aven');
        }
        this._CartService.cartNumber.set(res.numOfCartItems);
      },
    });
  }

  confirmBox() {
    Swal.fire({
      title: 'Are you sure want to clear your cart?',
      text: 'You will not be able to recover your items!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: 'rgb(224 36 36)',
    }).then((result) => {
      if (result.value) {
        this.clearCart();
        Swal.fire('Deleted!', 'Your cart items has been removed.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
