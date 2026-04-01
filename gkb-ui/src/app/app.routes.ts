import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Landingpage } from './shared/landingpage/landingpage';
import { BakingDashboard } from './baking-dashboard/baking-dashboard';
import { Userorders } from './userorders/userorders';
import { Ordertacking } from './ordertacking/ordertacking';
import { ProductDetails } from './product-details/product-details';

export const routes: Routes = [

    {path:'',component:Landingpage},
    {path:'login',component:Landingpage},
    {path:'#',component:Landingpage},
    {path:'landingpage',component:Landingpage},
    {path:'bdashboard',component:BakingDashboard},
    {path:'yourorders',component:Userorders},
    {path:'order',component:Ordertacking},
    {path:'productdetails/:id',component:ProductDetails},
    {path:'**',component:Landingpage}

];
