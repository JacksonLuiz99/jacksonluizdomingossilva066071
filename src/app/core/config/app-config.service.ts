import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  API_BASE_URL: string;
  APP_VERSION: string;
  BUILD_TIME: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private http = inject(HttpClient);
  private _config: AppConfig | null = null;

  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get<AppConfig>('assets/config.json')).then(
      (config) => {
        this._config = config;
      },
    );
  }

  get config(): AppConfig {
    if (!this._config) throw new Error('AppConfig não carregado.');
    return this._config;
  }

  get apiBaseUrl(): string {
    return this.config.API_BASE_URL;
  }
}
