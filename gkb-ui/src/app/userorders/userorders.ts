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

  printOrder(order: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.loading.show();
    this.orderService.getOrderDetails(order.orderId).subscribe({
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
