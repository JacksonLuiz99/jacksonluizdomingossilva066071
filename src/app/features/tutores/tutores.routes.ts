import { Routes } from '@angular/router';

export const TUTORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/tutores-list/tutores-list.page').then(
        (m) => m.TutoresListPage,
      ),
  },
  {
    path: 'novo',
    loadComponent: () =>
      import('./pages/tutor-form/tutor-form.page').then((m) => m.TutorFormPage),
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./pages/tutor-form/tutor-form.page').then((m) => m.TutorFormPage),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./pages/tutor-detail/tutor-detail.page').then(
        (m) => m.TutorDetailPage,
      ),
  },
];
