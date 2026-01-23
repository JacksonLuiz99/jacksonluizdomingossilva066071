import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  finalize,
  map,
  switchMap,
  take,
  throwError,
} from "rxjs";
import { AuthApiService } from "./auth-api.service";
import { AuthFacade } from "./auth.facade";
import { SnackbarService } from "../ui/snackbar.service";

@Injectable({ providedIn: "root" })
export class AuthRefreshService {
  private api = inject(AuthApiService);
  private auth = inject(AuthFacade);
  private router = inject(Router);
  private snack = inject(SnackbarService);

  private refreshing$ = new BehaviorSubject<boolean>(false);
  private refreshedToken$ = new BehaviorSubject<string | null>(null);

  refreshOnce(): Observable<string> {
    const isRefreshing = this.refreshing$.getValue();
    const refreshToken = this.auth.getRefreshTokenSnapshot();

    if (!refreshToken) {
      this.handleRefreshFailure("Sessão expirada");
      return throwError(() => new Error("Sem refreshToken."));
    }

    if (isRefreshing) {
      // aguarda a conclusão para pegar o token emitido
      return this.refreshedToken$.pipe(
        filter((t): t is string => !!t),
        take(1)
      );
    }

    this.refreshing$.next(true);
    this.refreshedToken$.next(null);

    return this.api.refresh(refreshToken).pipe(
      map((res) => {
        this.auth.setTokens(res.accessToken, res.refreshToken);
        this.refreshedToken$.next(res.accessToken);
        console.log("Token renovado com sucesso");
        return res.accessToken;
      }),
      catchError((err) => {
        console.error("Falha ao renovar token:", err);

        // trata a mensagem de erro
        const errorMsg = err?.error?.message || "Sua sessão expirou";
        this.handleRefreshFailure(errorMsg);

        return throwError(() => err);
      }),
      finalize(() => this.refreshing$.next(false))
    );
  }

  private handleRefreshFailure(message: string) {
    // Limpar tokens inválidos
    this.auth.logout();

    // Salvar URL atual para retornar depois do login
    const currentUrl = this.router.url;
    const returnUrl = currentUrl !== "/login" ? currentUrl : "/pets";

    // Notificar usuário com um snackbar
    this.snack.error(`${message}. Faça login novamente.`);

    // Redirecionar para tela de login
    setTimeout(() => {
      this.router.navigate(["/login"], {
        queryParams: { returnUrl },
      });
    }, 500); // Pequeno delay antes de exibir o snackbar
  }
}
