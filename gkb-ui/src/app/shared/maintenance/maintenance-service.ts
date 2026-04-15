import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class maintenanceService {
  private maintenance_state = new BehaviorSubject<boolean>(false);
  public maintenance_ = this.maintenance_state.asObservable();

  getmaintenance() {
    return this.maintenance_state.value;
  }
  setmaintenance(mode: true | false) {
    this.maintenance_state.next(mode);
  }
}
