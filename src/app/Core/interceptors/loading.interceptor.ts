import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

let requestCount = 0;
let currentCount = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const _NgxSpinnerService = inject(NgxSpinnerService);

  requestCount++;
  //Show Loading
  _NgxSpinnerService.show();

  //Hide Loading
  return next(req).pipe(
    finalize(() => {
      currentCount++;
      if (requestCount == currentCount) {
        _NgxSpinnerService.hide();
      }
    })
  );
};
