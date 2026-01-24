import {
  ApplicationConfig,
  provideZoneChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppConfigService } from './core/config/app-config.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PtBrPaginatorIntl } from './core/i18n/pt-br-paginator-intl';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { routes } from './app.routes';

export function initConfig(configService: AppConfigService) {
  return () => configService.loadConfig();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true,
    },
    { provide: MatPaginatorIntl, useClass: PtBrPaginatorIntl },
    provideEnvironmentNgxMask(),
  ],
};
