import { Routes } from '@angular/router';
import { ShopLayout } from './shop-layout/shop-layout';
import { ShopDashboard } from './shop-dashboard/shop-dashboard';
import { ShopProfile } from './shop-profile/shop-profile';
import { ShopOffers } from './shop-offers/shop-offers';
import { ShopReviews } from './shop-reviews/shop-reviews';

export const SHOP_ROUTES: Routes = [
    {
        path: '',
        component: ShopLayout,
        children: [
            { path: 'dashboard', component: ShopDashboard },
            { path: 'profile', component: ShopProfile },
            { path: 'offers', component: ShopOffers },
            { path: 'reviews', component: ShopReviews },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
