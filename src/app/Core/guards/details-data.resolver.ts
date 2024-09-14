import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductsService } from '../Services/products.service';

export const detailsDataResolver: ResolveFn<boolean> = (route, state) => {
  const _ProductsService = inject(ProductsService);
  return _ProductsService.getSpecificProduct(route.paramMap.get('id'));
};
