import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import { AppConfigService } from "../config/app-config.service";
import { LoginRequest, LoginResponse, RefreshResponse } from "./auth.models";

@Injectable({ providedIn: "root" })
export class AuthApiService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);

  login(body: LoginRequest) {
    // API está retornando o padrão snake_case, mas o front usamos camelCase
    return this.http
      .post<any>(`${this.config.apiBaseUrl}/autenticacao/login`, body)
      .pipe(
        map(
          (response): LoginResponse => ({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            expiresIn: response.expires_in,
            user: response.user,
          }),
        ),
      );
  }

  refresh(refreshToken: string) {
    // O refresh token enviado no cabeçalho Authorization
    return this.http
      .put<any>(
        `${this.config.apiBaseUrl}/autenticacao/refresh`,
        {}, // Body vazio
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      )
      .pipe(
        map(
          (response): RefreshResponse => ({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            expiresIn: response.expires_in,
          }),
        ),
      );
  }
}
