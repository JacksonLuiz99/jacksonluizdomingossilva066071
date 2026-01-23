import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SnackbarService } from '../ui/snackbar.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snack = inject(SnackbarService);

  return next(req).pipe(
    catchError((err) => {
      const msg =
        err?.error?.message ||
        err?.message ||
        'Erro inesperado ao comunicar com a API.'; // evita spammar em endpoints de listagem com erro repetido?
      snack.error(msg);
      return throwError(() => err);
    }),
  );
};
