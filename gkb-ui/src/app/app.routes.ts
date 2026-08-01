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
import { Stock } from './Admin/master/stock/stock';
import { Wishlists } from './Admin/master/wishlists/wishlists';
import { Ratings } from './Admin/master/ratings/ratings';
import { Role } from './Admin/master/role/role';
import { Deliverycharge } from './Admin/master/deliverycharge/deliverycharge';
import { Additionalcharge } from './Admin/master/additionalcharge/additionalcharge';
import { Usermaster } from './Admin/master/usermaster/usermaster';
import { PaymentMasterComponent } from './Admin/master/payment/payment';
import { AdminOrdersComponent } from './Admin/orders/orders';
import { authGuard } from './shared/auth-guard';

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
      { path: 'yourorders', component: Userorders, canActivate: [authGuard] },
      { path: 'order', component: Ordertacking, canActivate: [authGuard] },
      { path: 'maintenance', component: Maintenance },
      { path: 'userprofile', component: Userprofile, canActivate: [authGuard] },
      { path: 'productdetails/:id', component: ProductDetails },
      { path: 'yourcart', component: Cart, canActivate: [authGuard] },
      { path: 'about', component: AboutPage },
      { path: 'admin/products', component: Products },
      { path: 'admin/recipes', component: Recipe },
      { path: 'admin/stock', component: Stock },
      { path: 'admin/wishlists', component: Wishlists },
      { path: 'admin/ratings', component: Ratings },
      { path: 'admin/roles', component: Role },
      { path: 'admin/deliverycharges', component: Deliverycharge },
      { path: 'admin/additionalcharges', component: Additionalcharge },
      { path: 'admin/users', component: Usermaster },
      { path: 'admin/payments', component: PaymentMasterComponent },
      { path: 'admin/orders', component: AdminOrdersComponent },
      { path: 'admin', component: AdminDashboard },
      { path: '**', component: Landingpage },
    ],
  },
];
