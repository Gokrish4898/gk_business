import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AdminOrdersService } from './orders-service';
import { Loading } from '../../shared/spinner/loading';
import { ToastService } from '../../shared/toaster/toast-service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatPaginatorModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  totalCount = 0;

  // Search & Filters
  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'createdOn';
  sortOrder = 'desc';

  // Pagination
  pageSize = 5;
  pageIndex = 0;

  // Selected Order for Details Modal
  selectedOrder: any = null;

  // Selected Order for Status Update Modal
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

  isStatusModalOpen = false;
  statusUpdate = {
    orderId: 0,
    status: '',
    statusMessage: ''
  };

  // Predefined tracking sequence map
  statusSteps = ['Pending', 'Confirmed', 'Preparing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

  // All statuses including post-delivery cancellation/refunds
  allStatuses = ['Pending', 'Confirmed', 'Preparing', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Rejected', 'Returned', 'Refunded'];

  constructor(
    private ordersService: AdminOrdersService,
    private loading: Loading,
    private toastr: ToastService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.show();
    const params = {
      searchTerm: this.searchTerm || undefined,
      statusFilter: this.statusFilter !== 'all' ? this.statusFilter : undefined,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };

    this.ordersService.getOrders(params).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body) {
          this.orders = res.body.orders || [];
          this.totalCount = res.body.totalCount || 0;
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to load orders history.', 'error');
      }
    });
  }

  onFilterChange() {
    this.pageIndex = 0;
    this.loadOrders();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadOrders();
  }

  viewOrderDetails(id: number) {
    this.loading.show();
    this.ordersService.getOrderDetails(id).subscribe({
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

  // Status Modals Toggles
  openStatusModal(order: any, event: Event) {
    event.stopPropagation(); // prevent row click view details
    this.statusUpdate = {
      orderId: order.orderId,
      status: order.orderStatus,
      statusMessage: ''
    };
    this.isStatusModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeStatusModal() {
    this.isStatusModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  submitStatusUpdate() {
    if (!this.statusUpdate.status) {
      this.toastr.show('Please select a valid order status.', 'error');
      return;
    }

    this.loading.show();
    this.ordersService.updateOrderStatus(this.statusUpdate).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Order status updated successfully.', 'success');
        this.closeStatusModal();
        this.loadOrders();
        // If modal order details is open, refresh it
        if (this.selectedOrder && this.selectedOrder.orderId === this.statusUpdate.orderId) {
          this.viewOrderDetails(this.statusUpdate.orderId);
        }
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to update order status.', 'error');
      }
    });
  }

  // Helpers
  isCancelledStatus(status: string): boolean {
    const cancelStatuses = ['Cancelled', 'Rejected', 'Returned', 'Refunded'];
    return cancelStatuses.includes(status);
  }
}
