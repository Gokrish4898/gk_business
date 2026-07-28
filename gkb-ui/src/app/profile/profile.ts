import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from './profile-service';
import { Loading } from '../shared/spinner/loading';
import { ToastService } from '../shared/toaster/toast-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  activeTab: 'personal' | 'addresses' | 'password' = 'personal';

  // Personal Info form
  profileData = {
    firstName: '',
    lastName: '',
    displayName: '',
    gender: 'Other',
    dateOfBirth: '',
    profilePicture: '',
    mobile: '',
    email: '',
    createdOn: ''
  };

  // Password Change form
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Addresses list
  addresses: any[] = [];

  // Address Modal state
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

  modalTitle = 'Add Address';
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
    private profileService: ProfileService,
    private loading: Loading,
    private toastr: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadAddresses();
  }

  loadProfile() {
    this.loading.show();
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body) {
          const body = res.body;
          this.profileData = {
            firstName: body.firstName || '',
            lastName: body.lastName || '',
            displayName: body.displayName || body.username || '',
            gender: body.gender || 'Other',
            dateOfBirth: body.dateOfBirth ? body.dateOfBirth.split('T')[0] : '',
            profilePicture: body.profilePicture || '',
            mobile: body.mobile || '',
            email: body.email || '',
            createdOn: body.createdOn ? new Date(body.createdOn).toLocaleDateString() : ''
          };
        }
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to load user profile.', 'error');
      }
    });
  }

  loadAddresses() {
    this.profileService.listAddresses().subscribe({
      next: (res) => {
        if (res.body && res.body.addresses) {
          this.addresses = res.body.addresses;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  saveProfile() {
    this.loading.show();
    this.profileService.updateProfile(this.profileData).subscribe({
      next: (res) => {
        this.loading.hide();
        // Update cached name in localStorage
        if (this.profileData.displayName) {
          localStorage.setItem('username', this.profileData.displayName);
        }
        this.toastr.show('Personal information updated successfully.', 'success');
        this.loadProfile();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to update profile.', 'error');
      }
    });
  }

  savePassword(form: any) {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.toastr.show('Confirm password does not match.', 'error');
      return;
    }

    this.loading.show();
    const payload = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.profileService.changePassword(payload).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Password changed successfully.', 'success');
        this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        form.resetForm();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to update password.', 'error');
      }
    });
  }

  // Address Actions
  openAddAddress() {
    this.modalTitle = 'Add Shipping Address';
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

  openEditAddress(address: any) {
    this.modalTitle = 'Modify Shipping Address';
    this.modalAddress = { ...address };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitAddress() {
    this.loading.show();
    if (this.modalAddress.addressId === 0) {
      // Add
      this.profileService.addAddress(this.modalAddress).subscribe({
        next: () => {
          this.loading.hide();
          this.toastr.show('New address added successfully.', 'success');
          this.closeModal();
          this.loadAddresses();
        },
        error: (err) => {
          this.loading.hide();
          this.toastr.show(err.error?.error || 'Failed to save address.', 'error');
        }
      });
    } else {
      // Edit
      this.profileService.updateAddress(this.modalAddress).subscribe({
        next: () => {
          this.loading.hide();
          this.toastr.show('Address updated successfully.', 'success');
          this.closeModal();
          this.loadAddresses();
        },
        error: (err) => {
          this.loading.hide();
          this.toastr.show(err.error?.error || 'Failed to save address.', 'error');
        }
      });
    }
  }

  deleteAddress(id: number) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    this.loading.show();
    this.profileService.deleteAddress(id).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Address deleted successfully.', 'success');
        this.loadAddresses();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to delete address.', 'error');
      }
    });
  }

  setAsDefault(id: number) {
    this.loading.show();
    this.profileService.setDefaultAddress(id).subscribe({
      next: () => {
        this.loading.hide();
        this.toastr.show('Default address updated.', 'success');
        this.loadAddresses();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to set default address.', 'error');
      }
    });
  }

  selectAvatar(avatarName: string) {
    this.profileData.profilePicture = avatarName;
  }
}
