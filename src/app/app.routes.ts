import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pets',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login.page').then((m) => m.LoginPage),
  },

  { path: '**', redirectTo: 'pets' },
];
