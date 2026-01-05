import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Landingpage } from './shared/landingpage/landingpage';
import { BakingDashboard } from './baking-dashboard/baking-dashboard';

export const routes: Routes = [

    {path:'',component:Login},
    {path:'login',component:Login},
    {path:'#',component:Login},
    {path:'landingpage',component:Landingpage},
    {path:'bdashboard',component:BakingDashboard},
    {path:'**',component:Login}

];
