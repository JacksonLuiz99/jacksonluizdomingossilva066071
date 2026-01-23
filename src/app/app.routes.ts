import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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

  {
    path: "pets",
    canActivate: [authGuard],
    loadChildren: () =>
      import("./features/pets/pets.routes").then((m) => m.PETS_ROUTES),
  },

  { path: '**', redirectTo: 'pets' },
];
