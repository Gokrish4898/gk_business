import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';

export interface StockItem {
  stockid: number;
  stockname: string;
  unit: string;
  unitprice: number;
  availability: number;
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
  allStock: StockItem[] = [
    { stockid: 301, stockname: 'Cocoa Powder', unit: 'g', unitprice: 5, availability: 1500 },
    { stockid: 302, stockname: 'Granulated Sugar', unit: 'g', unitprice: 2, availability: 5000 },
    { stockid: 303, stockname: 'Unsalted Butter', unit: 'g', unitprice: 8, availability: 2000 },
    { stockid: 304, stockname: 'Fresh Eggs', unit: 'pcs', unitprice: 1, availability: 120 },
    { stockid: 305, stockname: 'All-Purpose Flour', unit: 'g', unitprice: 3, availability: 8000 },
    { stockid: 306, stockname: 'Cake Flour', unit: 'g', unitprice: 4, availability: 4000 },
    { stockid: 307, stockname: 'Buttermilk', unit: 'ml', unitprice: 3, availability: 2500 },
    { stockid: 308, stockname: 'Red Food Coloring', unit: 'ml', unitprice: 12, availability: 0 },
    { stockid: 309, stockname: 'Bread Flour', unit: 'g', unitprice: 3, availability: 6000 },
    { stockid: 310, stockname: 'Fine Sea Salt', unit: 'g', unitprice: 1, availability: 800 }
  ];

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
    stockname: '',
    unit: 'g',
    unitprice: 0,
    availability: 0
  };

  // Predefined list of standard units
  availableUnits = ['g', 'kg', 'ml', 'l', 'pcs', 'tsp', 'tbsp', 'cup', 'pinch'];

  constructor(private loading: Loading) {}

  ngOnInit() {
    this.loading.showAndAutoHide();
    this.updateDisplayedStock();
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
      stockname: '',
      unit: 'g',
      unitprice: 0,
      availability: 0
    };
    this.isModalOpen = true;
  }

  editStock() {
    if (this.selectedStockId) {
      const item = this.allStock.find(s => s.stockid === this.selectedStockId);
      if (item) {
        this.modalTitle = 'Edit Stock';
        this.modalStock = { ...item };
        this.isModalOpen = true;
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitStock(formValue: { stockname: string; unit: string; unitprice: number; availability: number }) {
    if (this.modalTitle === 'Add Stock') {
      const nextId = this.allStock.length > 0 ? Math.max(...this.allStock.map(s => s.stockid)) + 1 : 301;
      const newStock: StockItem = {
        stockid: nextId,
        stockname: formValue.stockname,
        unit: formValue.unit,
        unitprice: Number(formValue.unitprice),
        availability: Number(formValue.availability)
      };
      this.allStock.push(newStock);
    } else if (this.modalTitle === 'Edit Stock' && this.selectedStockId !== null) {
      const index = this.allStock.findIndex(s => s.stockid === this.selectedStockId);
      if (index !== -1) {
        this.allStock[index] = {
          stockid: this.selectedStockId,
          stockname: formValue.stockname,
          unit: formValue.unit,
          unitprice: Number(formValue.unitprice),
          availability: Number(formValue.availability)
        };
      }
    }
    this.updateDisplayedStock();
    this.closeModal();
    this.selectedStockId = null; // Clear selection
  }
}
