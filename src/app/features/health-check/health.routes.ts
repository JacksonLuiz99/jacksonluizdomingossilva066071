import { Routes } from '@angular/router';

export const HEALTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./health-check/health.page').then((m) => m.HealthPage),
  },
];
