import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  
  // Mock Cart Data
  cartItems = [
    {
      id: '101',
      image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Truffle Mushroom Pizza',
      recipeNote: 'Hand-tossed sourdough, wild mushrooms, truffle oil, and aged parmesan.',
      price: 24.50,
      deliveryAddress: '42B Baker Street, Downtown, NY'
    },
    {
      id: '102',
      image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Golden Garlic Knots',
      recipeNote: 'Wood-fired dough knots drenched in garlic butter and parsley.',
      price: 8.00,
      deliveryAddress: '42B Baker Street, Downtown, NY'
    }
  ];

  deliveryFee: number = 4.99;

  // Calculate the subtotal dynamically
  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  // Calculate grand total
  get grandTotal(): number {
    return this.subtotal + this.deliveryFee;
  }

  removeItem(id: string) {
    this.cartItems = this.cartItems.filter(item => item.id !== id);
  }
}