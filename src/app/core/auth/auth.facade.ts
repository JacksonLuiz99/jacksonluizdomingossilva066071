import { Injectable, inject } from "@angular/core";
import { catchError, finalize, map, of, tap } from "rxjs";
import { AuthApiService } from "./auth-api.service";
import { AuthStore } from "./auth.store";
import { TokenStorageService } from "./token-storage.service";

@Injectable({ providedIn: "root" })
export class AuthFacade {
  private api = inject(AuthApiService);
  private store = inject(AuthStore);
  private tokenStorage = inject(TokenStorageService);

  readonly user$ = this.store.user$;
  readonly isAuthenticated$ = this.store.isAuthenticated$;
  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  initFromStorage() {
    const accessToken = this.tokenStorage.getAccessToken();
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (accessToken && refreshToken) {
      this.store.patch({
        accessToken,
        refreshToken,
        isAuthenticated: true,
        error: null,
      });
    }
  }

  login(username: string, password: string) {
    this.store.patch({ loading: true, error: null });
    return this.api.login({ username, password }).pipe(
      tap((res) => {
        this.tokenStorage.setTokens(res.accessToken, res.refreshToken);
        this.store.patch({
          user: res.user ?? null,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          isAuthenticated: true,
        });
      }),
      map(() => true),
      catchError((err) => {
        const msg = err?.error?.message ?? "Falha ao autenticar.";
        this.store.patch({ error: msg, isAuthenticated: false });
        return of(false);
      }),
      finalize(() => this.store.patch({ loading: false }))
    );
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.tokenStorage.setTokens(accessToken, refreshToken);
    this.store.patch({ accessToken, refreshToken, isAuthenticated: true });
  }

  logout() {
    this.tokenStorage.clear();
    this.store.reset();
  }

  getAccessTokenSnapshot(): string | null {
    return this.store.snapshot.accessToken;
  }

  getRefreshTokenSnapshot(): string | null {
    return this.store.snapshot.refreshToken;
  }
}
