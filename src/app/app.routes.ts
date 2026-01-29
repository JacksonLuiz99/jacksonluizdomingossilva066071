import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login.page').then((m) => m.LoginPage),
  },

  {
    path: 'pets',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/pets/pets.routes').then((m) => m.PETS_ROUTES),
  },

  {
    path: 'tutores',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/tutores/tutores.routes').then((m) => m.TUTORES_ROUTES),
  },

  {
    path: 'health-checks',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/health-check/health.routes').then(
        (m) => m.HEALTH_ROUTES,
      ),
  },
  {
    path: 'contato',
    loadChildren: () =>
      import('./features/contacts/contacts.routes').then(
        (m) => m.CONTACT_ROUTES,
      ),
  },

  { path: '**', redirectTo: 'pets' },
];
