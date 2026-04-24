import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { maintenanceService } from './maintenance-service';

export const maintenanceGuard: CanActivateFn = (route, state) => {
  // debugger;
  const maintenance  = inject(maintenanceService);

  const maintenance_ = maintenance.getmaintenance();

  console.log(state.url)
  const router = inject(Router);
  if(maintenance_){
    router.navigate(["/maintenance"]);
    return false;
  }
  if(!maintenance_ && state.url === '/maintenance'){
    router.navigate(["/login"]);
    return false;
  }

  return true;
};
