import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { DeliveryChargeService } from './deliverycharge-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface PincodeChargeItem {
  pincode: string;
  charge: number;
}

export interface CityChargeItem {
  city: string;
  pincodes: PincodeChargeItem[];
}

export interface DeliveryChargeItem {
  deliveryId: number;
  city: CityChargeItem[];
  createdOn?: string;
  updatedOn?: string;
  createdBy?: number;
  updatedBy?: number;
  active?: number;
}

@Component({
  selector: 'app-deliverycharge',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  templateUrl: './deliverycharge.html',
  styleUrl: './deliverycharge.scss',
})
export class Deliverycharge implements OnInit {
  allCharges: DeliveryChargeItem[] = [];
  displayedCharges: DeliveryChargeItem[] = [];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;

  // Selection state
  selectedDeliveryId: number | null = null;
  expandedDeliveryId: number | null = null;

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
  modalTitle = 'Add Delivery Config';
  modalDelivery: {
    deliveryId: number,
    city: CityChargeItem[];
    active: number;
  } = {
    deliveryId: 0,
    city: [],
    active: 1
  };

  constructor(
    private loading: Loading,
    private deliveryservice: DeliveryChargeService,
    private toastr: ToastService,
  ) {}

  ngOnInit() {
    this._getdeliverycharges();
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

  selectDelivery(deliveryId: number) {
    if (this.selectedDeliveryId === deliveryId) {
      this.selectedDeliveryId = null;
      this.expandedDeliveryId = null;
    } else {
      this.selectedDeliveryId = deliveryId;
      this.expandedDeliveryId = deliveryId;
    }
  }

  toggleExpand(deliveryId: number, event: Event) {
    event.stopPropagation();
    if (this.expandedDeliveryId === deliveryId) {
      this.expandedDeliveryId = null;
    } else {
      this.expandedDeliveryId = deliveryId;
    }
  }

  addConfig() {
    this.modalTitle = 'Add Delivery Config';
    this.modalDelivery = {
      deliveryId: 0,
      city: [
        {
          city: 'Pondicherry',
          pincodes: [{ pincode: '', charge: 0 }],
        },
      ],
      active: 1,
    };
    this.isModalOpen = true;
  }

  editConfig() {
    if (this.selectedDeliveryId) {
      const item = this.allCharges.find((d) => d.deliveryId === this.selectedDeliveryId);
      if (item) {
        this.modalTitle = 'Edit Delivery Config';
        // Deep copy the city-pincode structure to avoid mutating original state until saved
        const copyCity: CityChargeItem[] = item.city.map((c) => ({
          city: c.city,
          pincodes: c.pincodes.map((p) => ({ ...p })),
        }));

        this.modalDelivery = {
          deliveryId: item.deliveryId,
          city: copyCity,
          active: item.active ?? 1,
        };
        this.isModalOpen = true;
      }
    }
  }

  addCityBlock() {
    this.modalDelivery.city.push({
      city: '',
      pincodes: [{ pincode: '', charge: 0 }],
    });
  }

  removeCityBlock(cityIndex: number) {
    if (this.modalDelivery.city.length > 1) {
      this.modalDelivery.city.splice(cityIndex, 1);
    } else {
      this.modalDelivery.city[0] = {
        city: '',
        pincodes: [{ pincode: '', charge: 0 }],
      };
    }
  }

  addPincodeRow(cityIndex: number) {
    this.modalDelivery.city[cityIndex].pincodes.push({ pincode: '', charge: 0 });
  }

  removePincodeRow(cityIndex: number, pinIndex: number) {
    const pincodes = this.modalDelivery.city[cityIndex].pincodes;
    if (pincodes.length > 1) {
      pincodes.splice(pinIndex, 1);
    } else {
      pincodes[0] = { pincode: '', charge: 0 };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitConfig() {
    // Filter out any empty city names or empty pincodes
    const cleanCity: CityChargeItem[] = this.modalDelivery.city
      .filter((c) => c.city.trim())
      .map((c) => ({
        city: c.city.trim(),
        pincodes: c.pincodes
          .filter((p) => p.pincode.trim())
          .map((p) => ({
            pincode: p.pincode.trim(),
            charge: Number(p.charge),
          })),
      }))
      .filter((c) => c.pincodes.length > 0);

    if (cleanCity.length === 0) {
      this.toastr.show('Please configure at least one city and pincode', 'error');
      return;
    }

    const payload = {
      deliveryId: this.modalDelivery.deliveryId,
      city: cleanCity,
      active: Number(this.modalDelivery.active),
    };

    if (this.modalTitle === 'Add Delivery Config') {
      this._adddeliverycharge(payload);
    } else {
      this._editdeliverycharge(payload);
    }
    this.closeModal();
    this.selectedDeliveryId = null;
    this.expandedDeliveryId = null;
  }

  _adddeliverycharge(payload: any) {
    this.loading.show();
    this.deliveryservice.adddeliverycharge(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null) {
          this.toastr.show('Delivery Charge Config Added', 'success');
        }
        this._getdeliverycharges();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res.error?.message || 'Failed to add delivery config', 'error');
      },
    });
  }

  _editdeliverycharge(payload: any) {
    this.loading.show();
    this.deliveryservice.editdeliverycharge(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null) {
          this.toastr.show('Delivery Charge Config Updated', 'success');
        }
        this._getdeliverycharges();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res.error?.message || 'Failed to update delivery config', 'error');
      },
    });
  }

  _getdeliverycharges() {
    this.loading.show();
    this.deliveryservice.getdeliverycharge().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          this.allCharges = res.body.stocklst.map((d: any) => {
            let cityRaw = d.city ?? d.City;
            let parsedCity: CityChargeItem[] = [];
            if (typeof cityRaw === 'string') {
              try {
                parsedCity = JSON.parse(cityRaw);
              } catch (e) {
                parsedCity = [];
              }
            } else if (Array.isArray(cityRaw)) {
              parsedCity = cityRaw;
            }

            return {
              deliveryId: d.deliveryId ?? d.deliveryid ?? d.DeliveryId,
              city: parsedCity,
              createdOn: d.createdOn ?? d.createdon,
              updatedOn: d.updatedOn ?? d.updatedon,
              createdBy: d.createdBy ?? d.createdby,
              updatedBy: d.updatedBy ?? d.updatedby,
              active: d.active ?? d.Active,
            };
          });
          this.updateDisplayedCharges();
        }
        this.toastr.show('Delivery Charges Loaded', 'success');
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show('Failed to load delivery charges', 'error');
      },
    });
  }
}
