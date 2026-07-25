import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Landingpage } from './shared/landingpage/landingpage';
import { BakingDashboard } from './baking-dashboard/baking-dashboard';
import { Userorders } from './userorders/userorders';
import { Ordertacking } from './ordertacking/ordertacking';
import { ProductDetails } from './product-details/product-details';
import { Maintenance } from './shared/maintenance/maintenance';
import { Userprofile } from './userprofile/userprofile';
import { maintenanceGuard } from './shared/maintenance/maintenance-guard';
import { Cart } from './cart/cart';
import { AboutPage } from './about-page/about-page';
import { Products } from './Admin/master/products/products';
import { AdminDashboard } from './Admin/admin-dashboard/admin-dashboard';
import { Recipe } from './Admin/master/recipe/recipe';

export const routes: Routes = [
  {
    path: 'maintenance',
    component: Maintenance,
    canActivateChild: [maintenanceGuard],
  },

  {
    path: '',
    canActivate: [maintenanceGuard],
    children: [
      { path: '', component: Landingpage },
      { path: 'login', component: Login },
      { path: '#', component: Landingpage },
      { path: 'landingpage', component: Landingpage },
      { path: 'bdashboard', component: BakingDashboard },
      { path: 'yourorders', component: Userorders },
      { path: 'order', component: Ordertacking },
      { path: 'maintenance', component: Maintenance },
      { path: 'userprofile', component: Userprofile },
      { path: 'productdetails/:id', component: ProductDetails },
      { path: 'yourcart', component: Cart },
      { path: 'about', component: AboutPage },
      { path: 'admin/products', component: Products },
      { path: 'admin/recipes', component: Recipe },
      { path: 'admin', component: AdminDashboard },
      { path: '**', component: Landingpage },
    ],
  },
];
