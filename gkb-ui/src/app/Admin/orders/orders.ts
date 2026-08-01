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

  // Selected Order for Recipe popup
  selectedOrderForRecipe: any = null;
  isRecipeModalOpen = false;

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

  openRecipeModal(order: any, event: Event) {
    event.stopPropagation();
    this.loading.show();
    this.ordersService.getOrderDetails(order.orderId).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body) {
          this.selectedOrderForRecipe = res.body;
          this.isRecipeModalOpen = true;
          if (typeof document !== 'undefined') {
            document.body.classList.add('modal-open');
          }
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to retrieve recipe details.', 'error');
      }
    });
  }

  closeRecipeModal() {
    this.isRecipeModalOpen = false;
    this.selectedOrderForRecipe = null;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  hasCustomizations(order: any): boolean {
    if (!order || !order.items) return false;
    return order.items.some((item: any) => item.recipeDetails && item.recipeDetails.length > 0);
  }

  printOrder(order: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.loading.show();
    this.ordersService.getOrderDetails(order.orderId).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body) {
          this.executePrint(res.body);
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to retrieve order details for printing.', 'error');
      }
    });
  }

  private executePrint(order: any) {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      this.toastr.show('Popup blocker prevented printing. Please allow popups.', 'warning');
      return;
    }

    const itemsHtml = order.items.map((item: any) => {
      let recipeHtml = '';
      if (item.recipeDetails && item.recipeDetails.length > 0) {
        recipeHtml = `
          <div style="font-size: 0.8rem; color: #555; margin-top: 4px; padding-left: 10px; border-left: 2px solid #ccc;">
            <strong>Customizations:</strong><br/>
            ${item.recipeDetails.map((ing: any) => `${ing.name}: ${ing.quantity} ${ing.unit || 'units'}`).join('<br/>')}
          </div>
        `;
      }
      return `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px 0;">
            <strong style="color: #333;">${item.productName}</strong>
            ${recipeHtml}
          </td>
          <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 0; text-align: right;">₹${item.productPrice.toFixed(2)}</td>
          <td style="padding: 10px 0; text-align: right;">₹${item.itemTotal.toFixed(2)}</td>
        </tr>
      `;
    }).join('');

    const address = order.address || {};
    const payment = order.payment || {};

    const htmlContent = `
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 30px; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #b5835a; padding-bottom: 20px; margin-bottom: 20px; }
          .title { font-size: 24px; font-weight: bold; color: #b5835a; }
          .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .info-box { width: 48%; }
          .info-box h3 { font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { text-align: left; padding: 10px 0; border-bottom: 2px solid #eee; color: #666; font-size: 13px; text-transform: uppercase; }
          .summary { display: flex; justify-content: flex-end; }
          .summary-table { width: 300px; }
          .summary-table td { padding: 5px 0; }
          .total-row { font-size: 18px; font-weight: bold; color: #b5835a; border-top: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Gokrish Business</div>
            <div style="font-size: 12px; color: #666;">Premium Baking & Confectionery Service</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold; font-size: 16px;">INVOICE</div>
            <div style="font-size: 12px; color: #666;">Order #: ${order.orderNumber}</div>
            <div style="font-size: 12px; color: #666;">Date: ${new Date(order.createdOn).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="info-section">
          <div class="info-box">
            <h3>Shipping Information</h3>
            <strong>${address.fullName || 'N/A'}</strong><br/>
            Phone: +91 ${address.mobileNumber || ''}<br/>
            ${address.addressLine1 || ''}, ${address.addressLine2 || ''}<br/>
            ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}
          </div>
          <div class="info-box" style="text-align: right;">
            <h3>Payment Method</h3>
            <strong>${payment.paymentName || 'Cash On Delivery'}</strong><br/>
            Status: ${order.orderStatus}<br/>
            Description: ${payment.description || 'Secure Transaction'}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center; width: 80px;">Qty</th>
              <th style="text-align: right; width: 120px;">Unit Price</th>
              <th style="text-align: right; width: 120px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <table class="summary-table">
            <tr>
              <td>Subtotal</td>
              <td style="text-align: right;">₹${order.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>GST / Taxes (5%)</td>
              <td style="text-align: right;">₹${order.taxAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Delivery Charge</td>
              <td style="text-align: right;">₹${order.deliveryCharge.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td style="padding-top: 10px;">Grand Total</td>
              <td style="text-align: right; padding-top: 10px;">₹${order.grandTotal.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          Thank you for ordering with Gokrish Business!
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
