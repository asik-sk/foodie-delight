import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    {
        path: "add",
        loadComponent: () =>
          import("./components/restaurant-form/restaurant-form.component").
          then((m) => m.RestaurantFormComponent),
    },
    {
        path: "list",
        loadComponent: () =>
          import("./components/restaurant-list/restaurant-list.component").
          then((m) => m.RestaurantListComponent),
    },
    {
        path: "detail/:id",
        loadComponent: () =>
          import("./components/restaurant-form/restaurant-form.component").
          then((m) => m.RestaurantFormComponent),
    }
];
