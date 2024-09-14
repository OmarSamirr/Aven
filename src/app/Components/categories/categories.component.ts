import { Component, inject, signal, WritableSignal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ICategories } from '../../Core/Interfaces/icategories';
import { CartService } from '../../Core/Services/cart.service';
import { CategoriesService } from '../../Core/Services/categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private readonly _CategoriesService = inject(CategoriesService);

  categoriesList: WritableSignal<ICategories[]> = signal([]);
  getAllCategoriesSubscription!: Subscription;
  term: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.getAllCategoriesSubscription = this._CategoriesService
      .getCategories()
      .subscribe({
        next: (res) => {
          this.categoriesList.set(res.data);
          console.log(this.categoriesList());
        },
      });
  }

  ngOnDestroy(): void {
    this.getAllCategoriesSubscription?.unsubscribe();
  }
}
