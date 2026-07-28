import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { AdditionalChargeService } from './additionalcharge-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface ChargeItem {
  chargeId: number;
  chargeName: string;
  amount: number;
  createdOn?: string;
  updatedOn?: string;
  createdBy?: number;
  updatedBy?: number;
  active?: number;
}

@Component({
  selector: 'app-additionalcharge',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  templateUrl: './additionalcharge.html',
  styleUrl: './additionalcharge.scss',
})
export class Additionalcharge implements OnInit {
  allCharges: ChargeItem[] = [];
  displayedCharges: ChargeItem[] = [];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;

  // Selection state
  selectedChargeId: number | null = null;

  // Modal Dialog states
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
  modalTitle = 'Add Charge';
  modalCharge = {
    chargeId: 0,
    chargeName: '',
    amount: 0,
    active: 1,
  };

  constructor(
    private loading: Loading,
    private chargeservice: AdditionalChargeService,
    private toastr: ToastService,
  ) {}

  ngOnInit() {
    this._getcharges();
  }

  updateDisplayedCharges() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedCharges = this.allCharges.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedCharges();
  }

  selectCharge(chargeId: number) {
    if (this.selectedChargeId === chargeId) {
      this.selectedChargeId = null;
    } else {
      this.selectedChargeId = chargeId;
    }
  }

  addCharge() {
    this.modalTitle = 'Add Charge';
    this.modalCharge = {
      chargeId: 0,
      chargeName: '',
      amount: 0,
      active: 1,
    };
    this.isModalOpen = true;
  }

  editCharge() {
    if (this.selectedChargeId) {
      const item = this.allCharges.find((c) => c.chargeId === this.selectedChargeId);
      if (item) {
        this.modalTitle = 'Edit Charge';
        this.modalCharge = {
          chargeId: item.chargeId,
          chargeName: item.chargeName,
          amount: item.amount,
          active: item.active ?? 1,
        };
        this.isModalOpen = true;
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitCharge(formValue: { chargename: string; amount: number; active: number }) {
    if (!formValue.chargename.trim()) return;

    if (this.modalTitle === 'Add Charge') {
      const newCharge: ChargeItem = {
        chargeId: 0,
        chargeName: formValue.chargename.trim(),
        amount: Number(formValue.amount),
        active: Number(formValue.active),
      };
      this._addcharge(newCharge);
    } else if (this.modalTitle === 'Edit Charge' && this.selectedChargeId !== null) {
      const editCharge: ChargeItem = {
        chargeId: this.selectedChargeId,
        chargeName: formValue.chargename.trim(),
        amount: Number(formValue.amount),
        active: Number(formValue.active),
      };
      this._editcharge(editCharge);
    }
    this.closeModal();
    this.selectedChargeId = null;
  }

  _addcharge(newCharge: ChargeItem) {
    this.loading.show();
    this.chargeservice.addcharge(newCharge).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null) {
          this.toastr.show('Charge Added Successfully', 'success');
        }
        this._getcharges();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res.error?.message || 'Failed to add charge', 'error');
      },
    });
  }

  _editcharge(editCharge: ChargeItem) {
    this.loading.show();
    this.chargeservice.editcharge(editCharge).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null) {
          this.toastr.show('Charge Updated Successfully', 'success');
        }
        this._getcharges();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res.error?.message || 'Failed to update charge', 'error');
      },
    });
  }

  _getcharges() {
    this.loading.show();
    this.chargeservice.getcharge().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          this.allCharges = res.body.stocklst.map((c: any) => ({
            chargeId: c.chargeId ?? c.chargeid ?? c.ChargeId,
            chargeName: c.chargeName ?? c.charge_name ?? c.ChargeName,
            amount: c.amount ?? c.Amount,
            createdOn: c.createdOn ?? c.createdon,
            updatedOn: c.updatedOn ?? c.updatedon,
            createdBy: c.createdBy ?? c.createdby,
            updatedBy: c.updatedBy ?? c.updatedby,
            active: c.active ?? c.Active,
          }));
          this.updateDisplayedCharges();
        }
        this.toastr.show('Charges Loaded', 'success');
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show('Failed to load charges', 'error');
      },
    });
  }
}
