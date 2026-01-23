import { Routes } from "@angular/router";

export const PETS_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/pets-list/pets-list.page").then((m) => m.PetsListPage),
  },
  {
    path: "novo",
    loadComponent: () =>
      import("./pages/pet-form/pet-form.page").then((m) => m.PetFormPage),
  },
  {
    path: "editar/:id",
    loadComponent: () =>
      import("./pages/pet-form/pet-form.page").then((m) => m.PetFormPage),
  },
];
