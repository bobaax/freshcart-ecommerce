import { ToastrService } from 'ngx-toastr';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toasterServices = inject(ToastrService)

  return next(req).pipe(catchError((err) => {
    toasterServices.error(err.error.message || 'An unexpected error occurred', 'Error', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
      closeButton: true,
    });
    return throwError(() => err);
  }));
};
