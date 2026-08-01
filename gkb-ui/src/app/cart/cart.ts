import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from './cart-service';
import { ProfileService } from '../profile/profile-service'; // reuse profile service for address list/adds
import { Loading } from '../shared/spinner/loading';
import { ToastService } from '../shared/toaster/toast-service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartId = 0;
  cartItems: any[] = [];
  addresses: any[] = [];
  paymentMethods: any[] = [];
  deliveryConfigs: any[] = [];

  // Recipe popup state
  selectedCartItemForRecipe: any = null;
  isRecipeModalOpen = false;

  // Selections
  selectedAddressId = 0;
  selectedPaymentId = 0;
  deliveryNotes = '';

  // UI state
  isHandlingCollapsed = true;
  checkoutStep: 'cart' | 'checkout' = 'cart';

  // Modal State for Quick Add Address
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

  modalAddress = {
    addressId: 0,
    fullName: '',
    mobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    addressType: 'Home',
    isDefault: 0
  };

  constructor(
    private cartService: CartService,
    private profileService: ProfileService,
    private loading: Loading,
    private toastr: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadAddresses();
    this.loadPaymentMethods();
    this.loadDeliveryConfigs();
  }

  loadCart() {
    this.loading.show();
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body) {
          this.cartId = res.body.cartId;
          this.cartItems = res.body.items || [];
        }
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to retrieve cart items.', 'error');
      }
    });
  }

  loadAddresses() {
    this.profileService.listAddresses().subscribe({
      next: (res) => {
        if (res.body && res.body.addresses) {
          this.addresses = res.body.addresses;
          // Pre-select default address
          const defaultAddr = this.addresses.find(a => a.isDefault === 1);
          if (defaultAddr) {
            this.selectedAddressId = defaultAddr.addressId;
          } else if (this.addresses.length > 0) {
            this.selectedAddressId = this.addresses[0].addressId;
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadPaymentMethods() {
    this.cartService.getActivePayments().subscribe({
      next: (res) => {
        if (res.body && res.body.payments) {
          this.paymentMethods = res.body.payments;
          if (this.paymentMethods.length > 0) {
            this.selectedPaymentId = this.paymentMethods[0].paymentId;
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadDeliveryConfigs() {
    this.cartService.getDeliveryCharges().subscribe({
      next: (res) => {
        if (res.body && res.body.stocklst) {
          this.deliveryConfigs = res.body.stocklst;
        }
      },
      error: (err) => console.error(err)
    });
  }

  // Cart quantity controls
  increaseQty(item: any) {
    const newQty = item.quantity + 1;
    this.updateQuantity(item.cartItemId, newQty);
  }

  decreaseQty(item: any) {
    if (item.quantity <= 1) {
      this.removeItem(item.cartItemId);
      return;
    }
    const newQty = item.quantity - 1;
    this.updateQuantity(item.cartItemId, newQty);
  }

  updateQuantity(cartItemId: number, quantity: number) {
    this.loading.show();
    this.cartService.updateItemQuantity({ cartItemId, quantity }).subscribe({
      next: () => {
        this.loading.hide();
        this.loadCart();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to update quantity.', 'error');
      }
    });
  }

  removeItem(cartItemId: number) {
    if (!confirm('Remove this item from your cart?')) return;
    this.loading.show();
    this.cartService.removeItemFromCart(cartItemId).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Item removed from cart.', 'info');
        this.loadCart();
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to remove item.', 'error');
      }
    });
  }

  clearCart() {
    if (!confirm('Clear all items from your cart?')) return;
    this.loading.show();
    this.cartService.clearCart().subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Cart cleared.', 'info');
        this.loadCart();
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to clear cart.', 'error');
      }
    });
  }

  // Cost Computations
  getItemUnitPrice(item: any): number {
    if (item.cartDetails) {
      // If retrieved as a parsed object or string, read totalPrice
      const details = typeof item.cartDetails === 'string' 
        ? JSON.parse(item.cartDetails) 
        : item.cartDetails;
      if (details && (details.totalPrice !== undefined || details.totalprice !== undefined)) {
        return Number(details.totalPrice ?? details.totalprice);
      }
    }
    return item.productPrice;
  }

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (this.getItemUnitPrice(item) * item.quantity), 0);
  }

  get deliveryFee(): number {
    if (!this.selectedAddressId || this.addresses.length === 0) return 50;

    const selectedAddr = this.addresses.find(a => a.addressId === this.selectedAddressId);
    if (!selectedAddr || !selectedAddr.pincode) return 50;

    // Search pincode in master delivery configs
    let chargeFound = 50; // default
    let pincodeFound = false;

    for (const config of this.deliveryConfigs) {
      if (config.city) {
        for (const cityConfig of config.city) {
          const matchedPin = cityConfig.pincodes?.find((p: any) => p.pincode === selectedAddr.pincode);
          if (matchedPin) {
            chargeFound = Number(matchedPin.charge);
            pincodeFound = true;
            break;
          }
        }
      }
      if (pincodeFound) break;
    }
    return chargeFound;
  }

  get taxAmount(): number {
    return Math.round((this.subtotal * 0.05) * 100) / 100; // 5% GST
  }

  get grandTotal(): number {
    return this.subtotal + this.deliveryFee + this.taxAmount;
  }

  goToCheckout() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      this.toastr.show('Please login to place orders.', 'warning');
      this.router.navigate(['/login']);
      return;
    }
    if (this.cartItems.length === 0) {
      this.toastr.show('Your cart is empty.', 'warning');
      return;
    }
    this.checkoutStep = 'checkout';
  }

  backToCart() {
    this.checkoutStep = 'cart';
  }

  // Select Address and refresh delivery fee
  selectAddress(id: number) {
    this.selectedAddressId = id;
  }

  // Place final Order
  placeOrder() {
    if (!this.selectedAddressId) {
      this.toastr.show('Please select a shipping address.', 'error');
      return;
    }
    if (!this.selectedPaymentId) {
      this.toastr.show('Please select a payment method.', 'error');
      return;
    }

    this.loading.show();
    const payload = {
      addressId: this.selectedAddressId,
      paymentId: this.selectedPaymentId,
      deliveryNotes: this.deliveryNotes
    };

    this.cartService.placeOrder(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        this.toastr.show('Order placed successfully!', 'success');
        this.router.navigate(['/yourorders']);
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to place order.', 'error');
      }
    });
  }

  // Quick Address Addition Modal from Checkout Page
  openAddAddress() {
    this.modalAddress = {
      addressId: 0,
      fullName: '',
      mobileNumber: '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: '',
      country: 'India',
      pincode: '',
      addressType: 'Home',
      isDefault: 0
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitAddress() {
    this.loading.show();
    this.profileService.addAddress(this.modalAddress).subscribe({
      next: (res) => {
        this.loading.hide();
        this.toastr.show('Address added successfully.', 'success');
        this.closeModal();
        this.profileService.listAddresses().subscribe(listRes => {
          if (listRes.body && listRes.body.addresses) {
            this.addresses = listRes.body.addresses;
            if (res.body && res.body.address) {
              this.selectedAddressId = res.body.address.addressId;
            }
          }
        });
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to add address.', 'error');
      }
    });
  }

  toggleHandlingCollapse(event: Event) {
    event.preventDefault();
    this.isHandlingCollapsed = !this.isHandlingCollapsed;
  }

  openRecipeModal(item: any) {
    this.selectedCartItemForRecipe = item;
    this.isRecipeModalOpen = true;
    if (typeof document !== 'undefined') {
      document.body.classList.add('modal-open');
    }
  }

  closeRecipeModal() {
    this.isRecipeModalOpen = false;
    this.selectedCartItemForRecipe = null;
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }
}