import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    },
    {
        path: 'shop',
        loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES),
    },
    {
        path: 'client',
        loadChildren: () => import('./client/client.routes').then((m) => m.CLIENT_ROUTES),
        data: { animation: 'client' }
    },
    {
        path: '',
        redirectTo: 'client/home',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'client/home',
    },
];
