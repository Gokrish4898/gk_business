import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { map } from 'rxjs';
import { StockService } from './stock-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface StockItem {
  stockId: number;
  stockName: string;
  unit: string;
  unitPrice: number;
  availability: number;
  imagelink?: string;
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  templateUrl: './stock.html',
  styleUrl: './stock.scss',
})
export class Stock implements OnInit {
  // Mock database array representing standard schema fields
  // allStock: StockItem[] = [
  //   { stockid: 301, stockname: 'Cocoa Powder', unit: 'g', unitprice: 5, availability: 1500 },
  //   { stockid: 302, stockname: 'Granulated Sugar', unit: 'g', unitprice: 2, availability: 5000 },
  //   { stockid: 303, stockname: 'Unsalted Butter', unit: 'g', unitprice: 8, availability: 2000 },
  //   { stockid: 304, stockname: 'Fresh Eggs', unit: 'pcs', unitprice: 1, availability: 120 },
  //   { stockid: 305, stockname: 'All-Purpose Flour', unit: 'g', unitprice: 3, availability: 8000 },
  //   { stockid: 306, stockname: 'Cake Flour', unit: 'g', unitprice: 4, availability: 4000 },
  //   { stockid: 307, stockname: 'Buttermilk', unit: 'ml', unitprice: 3, availability: 2500 },
  //   { stockid: 308, stockname: 'Red Food Coloring', unit: 'ml', unitprice: 12, availability: 0 },
  //   { stockid: 309, stockname: 'Bread Flour', unit: 'g', unitprice: 3, availability: 6000 },
  //   { stockid: 310, stockname: 'Fine Sea Salt', unit: 'g', unitprice: 1, availability: 800 }
  // ];
  allStock: StockItem[] = [];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedStock: StockItem[] = [];

  // Selection state
  selectedStockId: number | null = null;

  // Modal Dialog states
  isModalOpen = false;
  modalTitle = 'Add Stock';
  modalStock = {
    stockId: 0,
    stockName: '',
    unit: 'g',
    unitPrice: 0,
    availability: 0,
    imagelink: '',
  };

  // Predefined list of standard units
  availableUnits = ['g', 'kg', 'ml', 'l', 'pcs', 'tsp', 'tbsp', 'cup', 'pinch'];

  constructor(
    private loading: Loading,
    private stockservice: StockService,
    private toastr: ToastService,
  ) {}

  ngOnInit() {
    this._getstock();
    // this.loading.showAndAutoHide();
    // this.updateDisplayedStock();
  }

  updateDisplayedStock() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedStock = this.allStock.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedStock();
  }

  selectStock(stockId: number) {
    if (this.selectedStockId === stockId) {
      this.selectedStockId = null; // deselect if clicked again
    } else {
      this.selectedStockId = stockId;
    }
  }

  addStock() {
    this.modalTitle = 'Add Stock';
    this.modalStock = {
      stockId: 0,
      stockName: '',
      unit: 'g',
      unitPrice: 0,
      availability: 0,
      imagelink: '',
    };
    this.isModalOpen = true;
  }

  editStock() {
    if (this.selectedStockId) {
      const item = this.allStock.find((s) => s.stockId === this.selectedStockId);
      if (item) {
        this.modalTitle = 'Edit Stock';
        this.modalStock = {
          stockId: item.stockId,
          stockName: item.stockName,
          unit: item.unit,
          unitPrice: item.unitPrice,
          availability: item.availability,
          imagelink: item.imagelink || '',
        };
        this.isModalOpen = true;
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitStock(formValue: {
    stockname: string;
    unit: string;
    unitprice: number;
    availability: number;
    imagelink?: string;
  }) {
    if (this.modalTitle === 'Add Stock') {
      const nextId =
        this.allStock.length > 0 ? Math.max(...this.allStock.map((s) => s.stockId)) + 1 : 301;
      const newStock: StockItem = {
        stockId: nextId,
        stockName: formValue.stockname,
        unit: formValue.unit,
        unitPrice: Number(formValue.unitprice),
        availability: Number(formValue.availability),
        imagelink: formValue.imagelink || '',
      };
      this._addstock(newStock);
    } else if (this.modalTitle === 'Edit Stock' && this.selectedStockId !== null) {
      const editStock: StockItem = {
        stockId: this.selectedStockId,
        stockName: formValue.stockname,
        unit: formValue.unit,
        unitPrice: Number(formValue.unitprice),
        availability: Number(formValue.availability),
        imagelink: formValue.imagelink || '',
      };
      this._editstock(editStock);
    }
    this.closeModal();
    this.selectedStockId = null; // Clear selection
  }
  _addstock(newStock: StockItem) {
    this.loading.show();
    this.stockservice.addstock(newStock).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body != null) {
          this.toastr.show('Stock Added Successfully', 'success');
        }
        this._getstock();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res, 'error', 'top-left');
      },
    });
  }
  _editstock(editStock: StockItem) {
    this.loading.show();
    this.stockservice.editstock(editStock).subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body != null) {
          this.toastr.show(editStock.stockName + 'Stock Added Successfully', 'success');
        }
        this._getstock();
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show(res, 'error', 'top-left');
      },
    });
  }
  _getstock() {
    this.loading.show();
    this.stockservice.getstock().subscribe({
      next: (res) => {
        this.loading.hide();

        // Ensure the response and the array actually exist
        if (res.body != null && res.body.stocklst != null) {
          // FIX: Directly assign the array!
          this.allStock = res.body.stocklst;

          console.log('⚡ [LogPurge] [stock.ts:171] allStock:', this.allStock);
          this.updateDisplayedStock();
        }
        this.toastr.show('Stock Loaded', 'success');
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show('Failed to load stock', 'error');
      },
    });
  }
}
