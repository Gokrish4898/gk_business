import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ordertacking',
  imports: [CommonModule],
  templateUrl: './ordertacking.html',
  styleUrl: './ordertacking.scss',
})
export class Ordertacking {
// The current status from your backend (e.g., 'READY')
  @Input() currentStatus: string = 'RECEIVED'; 

  // The Definition of your steps
  steps = [
    { key: 'RECEIVED', label: 'Order Received', icon: 'bi-file-text' },
    { key: 'READY',    label: 'Order Ready',    icon: 'bi-egg-fried' },
    { key: 'COMPLETED',label: 'Completed',      icon: 'bi-check-circle' },
    { key: 'DELIVERY', label: 'On Delivery',    icon: 'bi-truck' }
  ];

  // Helper to check if a step is finished/active
  isCompleted(stepIndex: number): boolean {
    const currentIndex = this.steps.findIndex(s => s.key === this.currentStatus);
    return stepIndex <= currentIndex;
  }
}
