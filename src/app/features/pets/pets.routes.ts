import { Routes } from "@angular/router";

export const PETS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/pets-list/pets-list.page").then((m) => m.PetsListPage),
  },
];
