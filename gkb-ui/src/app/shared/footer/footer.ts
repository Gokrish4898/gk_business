import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { maintenanceService } from '../maintenance/maintenance-service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  isKitchenOpen: boolean = false;
  constructor(private maintenance: maintenanceService) {
    this.isKitchenOpen = !maintenance.getmaintenance();
  }
}
