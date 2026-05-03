import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from './environments/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Skip absolute URLs
  if (req.url.startsWith('http')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `${environment.serviceurl}${req.url}`,
  });

  return next(apiReq); // ✅ use modified request
};
