import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

interface Product {
  productid: number;
  name: string;
  price: number;
  category: string;
  status: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  // Mock products data representing standard schema fields
  allProducts: Product[] = [
    { productid: 101, name: 'Classic Chocolate Brownie', price: 12.99, category: 'Brownie', status: 'In Stock' },
    { productid: 102, name: 'Red Velvet Cake Slice', price: 6.50, category: 'Cakes', status: 'In Stock' },
    { productid: 103, name: 'Artisan Sourdough Loaf', price: 8.00, category: 'Breads', status: 'In Stock' },
    { productid: 104, name: 'Warm Apple Pie', price: 15.00, category: 'Apple Pie', status: 'Out of Stock' },
    { productid: 105, name: 'Blueberry Muffin', price: 3.50, category: 'Muffins', status: 'In Stock' },
    { productid: 106, name: 'Double Chocolate Cookie', price: 2.50, category: 'Cookies', status: 'In Stock' },
    { productid: 107, name: 'Vanilla Bean Cupcake', price: 4.00, category: 'Cakes', status: 'In Stock' },
    { productid: 108, name: 'Cinnamon Roll', price: 4.50, category: 'Breads', status: 'In Stock' },
  ];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedProducts: Product[] = [];

  // Selection state
  selectedProductId: number | null = null;

  // Modal Dialog states
  isModalOpen = false;
  modalTitle = 'Add Product';
  modalProduct = {
    name: '',
    price: 0,
    category: 'Brownie',
    status: 'In Stock'
  };

  ngOnInit() {
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedProducts();
  }

  selectProduct(productId: number) {
    if (this.selectedProductId === productId) {
      this.selectedProductId = null; // deselect if clicked again
    } else {
      this.selectedProductId = productId;
    }
  }

  addProduct() {
    this.modalTitle = 'Add Product';
    this.modalProduct = {
      name: '',
      price: 0,
      category: 'Brownie',
      status: 'In Stock'
    };
    this.isModalOpen = true;
  }

  editProduct() {
    if (this.selectedProductId) {
      const prod = this.allProducts.find(p => p.productid === this.selectedProductId);
      if (prod) {
        this.modalTitle = 'Edit Product';
        this.modalProduct = { ...prod };
        this.isModalOpen = true;
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitProduct(formValue: { name: string; price: number; category: string; status: string }) {
    if (this.modalTitle === 'Add Product') {
      const nextId = this.allProducts.length > 0 ? Math.max(...this.allProducts.map(p => p.productid)) + 1 : 101;
      const newProduct: Product = {
        productid: nextId,
        name: formValue.name,
        price: Number(formValue.price),
        category: formValue.category,
        status: formValue.status
      };
      this.allProducts.push(newProduct);
    } else if (this.modalTitle === 'Edit Product' && this.selectedProductId !== null) {
      const index = this.allProducts.findIndex(p => p.productid === this.selectedProductId);
      if (index !== -1) {
        this.allProducts[index] = {
          productid: this.selectedProductId,
          name: formValue.name,
          price: Number(formValue.price),
          category: formValue.category,
          status: formValue.status
        };
      }
    }
    this.updateDisplayedProducts();
    this.closeModal();
    this.selectedProductId = null; // Clear selection
  }
}
