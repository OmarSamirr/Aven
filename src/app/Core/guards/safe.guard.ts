import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const safeGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('userToken') == null) {
      return true;
    } else {
      _Router.navigate(['/home']);
      return false;
    }
  } else {
    return false;
  }
};
