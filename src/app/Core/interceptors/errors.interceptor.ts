import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const _ToastrService = inject(ToastrService);
  return next(req).pipe(
    catchError((err) => {
      console.log('interceptor:', err);
      _ToastrService.error(err.error.message, 'Aven');

      return throwError(() => err);
    })
  );
};
