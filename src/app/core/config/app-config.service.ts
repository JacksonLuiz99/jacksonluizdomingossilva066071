import { Injectable } from '@angular/core';

export interface AppConfig {
  API_BASE_URL: string;
  APP_VERSION: string;
  BUILD_TIME: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private _config: AppConfig | null = null;

  get config(): AppConfig {
    if (!this._config) throw new Error('AppConfig não carregado.');
    return this._config;
  }

  get apiBaseUrl(): string {
    return this.config.API_BASE_URL;
  }
}
