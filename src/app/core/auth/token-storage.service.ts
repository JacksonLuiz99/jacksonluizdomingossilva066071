import { Injectable } from '@angular/core';

const KEY_ACCESS = 'pss_access_token';
const KEY_REFRESH = 'pss_refresh_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getAccessToken(): string | null {
    return localStorage.getItem(KEY_ACCESS);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(KEY_REFRESH);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(KEY_ACCESS, accessToken);
    localStorage.setItem(KEY_REFRESH, refreshToken);
  }

  clear() {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
  }
}
