import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";
import { AuthState } from "./auth.models";

const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

@Injectable({ providedIn: "root" })
export class AuthStore {
  private readonly _state$ = new BehaviorSubject<AuthState>(initialAuthState);
  readonly state$ = this._state$.asObservable();

  // seletores
  readonly user$ = this.state$.pipe(
    map((s) => s.user),
    distinctUntilChanged()
  );
  readonly isAuthenticated$ = this.state$.pipe(
    map((s) => s.isAuthenticated),
    distinctUntilChanged()
  );
  readonly loading$ = this.state$.pipe(
    map((s) => s.loading),
    distinctUntilChanged()
  );
  readonly error$ = this.state$.pipe(
    map((s) => s.error),
    distinctUntilChanged()
  );
  readonly accessToken$ = this.state$.pipe(
    map((s) => s.accessToken),
    distinctUntilChanged()
  );
  readonly refreshToken$ = this.state$.pipe(
    map((s) => s.refreshToken),
    distinctUntilChanged()
  );

  get snapshot(): AuthState {
    return this._state$.getValue();
  }

  patch(partial: Partial<AuthState>) {
    this._state$.next({ ...this.snapshot, ...partial });
  }

  reset() {
    this._state$.next(initialAuthState);
  }
}
