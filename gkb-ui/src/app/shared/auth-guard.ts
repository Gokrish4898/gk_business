import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from './toaster/toast-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastService);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!token) {
    toastr.show('Please login to place orders.', 'warning');
    router.navigate(['/login']);
    return false;
  }
  return true;
};
