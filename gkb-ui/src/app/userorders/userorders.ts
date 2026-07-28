import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserordersService } from './userorders-service';
import { Loading } from '../shared/spinner/loading';
import { ToastService } from '../shared/toaster/toast-service';

@Component({
  selector: 'app-userorders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './userorders.html',
  styleUrl: './userorders.scss'
})
export class Userorders implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;

  // Modal State
  private _isModalOpen = false;
  get isModalOpen(): boolean {
    return this._isModalOpen;
  }
  set isModalOpen(value: boolean) {
    this._isModalOpen = value;
    if (typeof document !== 'undefined') {
      if (value) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }

  // Predefined tracking sequence map
  statusSteps = ['Pending', 'Confirmed', 'Preparing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

  constructor(
    private orderService: UserordersService,
    private loading: Loading,
    private toastr: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.show();
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body && res.body.orders) {
          this.orders = res.body.orders;
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to retrieve order history.', 'error');
      }
    });
  }

  viewOrderDetails(id: number) {
    this.loading.show();
    this.orderService.getOrderDetails(id).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body) {
          this.selectedOrder = res.body;
          this.isModalOpen = true;
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to retrieve order details.', 'error');
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  cancelOrder(id: number) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.loading.show();
    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Order cancelled successfully.', 'success');
        this.loadOrders();
        if (this.selectedOrder && this.selectedOrder.orderId === id) {
          this.viewOrderDetails(id); // reload modal content
        }
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to cancel order.', 'error');
      }
    });
  }

  reorder(id: number) {
    this.loading.show();
    this.orderService.reorder(id).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Items added to cart successfully. Redirecting...', 'success');
        this.router.navigate(['/yourcart']);
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to reorder items.', 'error');
      }
    });
  }

  // Tracking logic checks
  isStepFinished(step: string, currentStatus: string): boolean {
    const cancelStatuses = ['Cancelled', 'Rejected', 'Returned', 'Refunded'];
    if (cancelStatuses.includes(currentStatus)) {
      return false; // don't highlight standard pipeline if cancelled
    }
    const targetIdx = this.statusSteps.indexOf(step);
    const currentIdx = this.statusSteps.indexOf(currentStatus);
    return targetIdx <= currentIdx;
  }

  isStepActive(step: string, currentStatus: string): boolean {
    return step.toLowerCase() === currentStatus.toLowerCase();
  }

  isCancelledStatus(status: string): boolean {
    const cancelStatuses = ['Cancelled', 'Rejected', 'Returned', 'Refunded'];
    return cancelStatuses.includes(status);
  }
}
