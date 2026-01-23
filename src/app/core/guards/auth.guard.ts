import { CanActivateFn, Router, ActivatedRouteSnapshot } from "@angular/router";
import { inject } from "@angular/core";
import { AuthFacade } from "../auth/auth.facade";
import { map, take } from "rxjs";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthFacade);
  const router = inject(Router);

  // tenta hidratar do storage ao abrir app
  auth.initFromStorage();
  
  return auth.isAuthenticated$.pipe(
    take(1),
    map((ok) => {
      if (ok) return true;

      // Construir URL com todos os segmentos e query params
      const urlSegments = route.pathFromRoot
        .map((r) => r.url.map((segment) => segment.toString()))
        .flat()
        .filter((segment) => segment.length > 0);

      const returnUrl = "/" + urlSegments.join("/");

      // Redirecionar para login com returnUrl
      return router.createUrlTree(["/login"], {
        queryParams: { returnUrl },
      });
    })
  );
};
