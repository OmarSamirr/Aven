import { Component, inject, signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ICategories } from '../../Core/Interfaces/icategories';
import { CartService } from '../../Core/Services/cart.service';
import { CategoriesService } from '../../Core/Services/categories.service';
import { BrandsService } from '../../Core/Services/brands.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  private readonly _BrandsService = inject(BrandsService);

  brandsList: WritableSignal<ICategories[]> = signal([]);
  getAllBrandsSubscription!: Subscription;
  term: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getAllBrandsSubscription = this._BrandsService
      .getBrands()
      .subscribe({
        next: (res) => {
          this.brandsList.set(res.data);
          console.log(this.brandsList());
        },
      });
  }

  ngOnDestroy(): void {
    this.getAllBrandsSubscription?.unsubscribe();
  }
}