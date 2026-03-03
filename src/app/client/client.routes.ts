import { Routes } from '@angular/router';
import { ClientHome } from './client-home/client-home';
import { ShopDetails } from './shop-details/shop-details';
import { ProductDetails } from './product-details/product-details';

export const CLIENT_ROUTES: Routes = [
    {
        path: 'home',
        component: ClientHome,
        data: { animation: 'HomePage' }
    },
    {
        path: 'shop/:id',
        component: ShopDetails,
        data: { animation: 'ShopPage' }
    },
    {
        path: 'product/:id',
        component: ProductDetails
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
];
