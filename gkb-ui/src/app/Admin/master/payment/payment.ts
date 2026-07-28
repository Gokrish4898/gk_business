import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaymentMasterService } from './payment-service';
import { Loading } from '../../../shared/spinner/loading';
import { ToastService } from '../../../shared/toaster/toast-service';

@Component({
  selector: 'app-payment-master',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatPaginatorModule],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentMasterComponent implements OnInit {
  allPayments: any[] = [];
  filteredPayments: any[] = [];
  displayedPayments: any[] = [];

  // Search filter
  searchTerm = '';

  // Pagination
  pageSize = 5;
  pageIndex = 0;

  // Selection
  selectedPaymentId: number | null = null;

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

  modalTitle = 'Add Payment Method';
  modalPayment = {
    paymentId: 0,
    paymentName: '',
    description: '',
    displayOrder: 1,
    active: 1
  };

  constructor(
    private paymentService: PaymentMasterService,
    private loading: Loading,
    private toastr: ToastService
  ) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.loading.show();
    this.paymentService.getPayments().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body && res.body.payments) {
          this.allPayments = res.body.payments;
          this.onFilterChange();
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to load payment methods.', 'error');
      }
    });
  }

  onFilterChange() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredPayments = [...this.allPayments];
    } else {
      this.filteredPayments = this.allPayments.filter(p =>
        p.paymentName.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }
    this.pageIndex = 0;
    this.updateDisplayedPayments();
  }

  updateDisplayedPayments() {
    const startIndex = this.pageIndex * this.pageSize;
    this.displayedPayments = this.filteredPayments.slice(startIndex, startIndex + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedPayments();
  }

  selectPayment(id: number) {
    this.selectedPaymentId = this.selectedPaymentId === id ? null : id;
  }

  openAddPayment() {
    this.modalTitle = 'Create Payment Method';
    this.modalPayment = {
      paymentId: 0,
      paymentName: '',
      description: '',
      displayOrder: this.allPayments.length + 1,
      active: 1
    };
    this.isModalOpen = true;
  }

  openEditPayment() {
    if (!this.selectedPaymentId) return;
    const payment = this.allPayments.find(p => p.paymentId === this.selectedPaymentId);
    if (payment) {
      this.modalTitle = 'Modify Payment Configuration';
      this.modalPayment = { ...payment };
      this.isModalOpen = true;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitPayment() {
    this.loading.show();
    if (this.modalPayment.paymentId === 0) {
      // Add
      this.paymentService.addPayment(this.modalPayment).subscribe({
        next: () => {
          this.loading.hide();
          this.toastr.show('Payment method configured successfully.', 'success');
          this.closeModal();
          this.loadPayments();
          this.selectedPaymentId = null;
        },
        error: (err) => {
          this.loading.hide();
          this.toastr.show(err.error?.error || 'Failed to save configuration.', 'error');
        }
      });
    } else {
      // Update
      this.paymentService.updatePayment(this.modalPayment).subscribe({
        next: () => {
          this.loading.hide();
          this.toastr.show('Payment configuration updated.', 'success');
          this.closeModal();
          this.loadPayments();
          this.selectedPaymentId = null;
        },
        error: (err) => {
          this.loading.hide();
          this.toastr.show(err.error?.error || 'Failed to save configuration.', 'error');
        }
      });
    }
  }

  deletePayment() {
    if (!this.selectedPaymentId) return;
    if (!confirm('Are you sure you want to disable/delete this payment configuration?')) return;

    this.loading.show();
    this.paymentService.deletePayment(this.selectedPaymentId).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Payment configuration disabled.', 'success');
        this.loadPayments();
        this.selectedPaymentId = null;
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to delete configuration.', 'error');
      }
    });
  }

  get activePaymentsCount(): number {
    return this.allPayments.filter(p => p.active === 1).length;
  }

  get inactivePaymentsCount(): number {
    return this.allPayments.filter(p => p.active !== 1).length;
  }
}

