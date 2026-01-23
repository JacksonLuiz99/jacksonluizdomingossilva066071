import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";

import { AuthFacade } from "../auth/auth.facade";
import { AuthRefreshService } from "../auth/auth-refresh.service";

function isAuthEndpoint(url: string) {
  return (
    url.includes("/autenticacao/login") || url.includes("/autenticacao/refresh")
  );
}

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthFacade);
  const refresher = inject(AuthRefreshService);

  const accessToken = auth.getAccessTokenSnapshot();

  // Se não tem token ou é endpoint de auth, continua normalmente
  if (!accessToken || isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Adiciona token na requisição
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
  });

  // REATIVO: Se receber 401, tenta refresh UMA vez
  return next(cloned).pipe(
    catchError((err: unknown) => {
      const httpErr = err as HttpErrorResponse;

      if (httpErr?.status !== 401) return throwError(() => err);
      if (isAuthEndpoint(req.url)) return throwError(() => err);

      // Tenta refresh e repete request
      return refresher.refreshOnce().pipe(
        switchMap((newToken) => {
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` },
          });
          return next(retried);
        }),
        catchError((refreshErr) => throwError(() => refreshErr))
      );
    })
  );
};
