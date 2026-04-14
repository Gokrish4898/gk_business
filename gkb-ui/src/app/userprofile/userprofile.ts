import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-userprofile',
  imports: [CommonModule, FormsModule],
  templateUrl: './userprofile.html',
  styleUrl: './userprofile.scss',
})
export class Userprofile {
  // Controls what the card is displaying
  viewMode: 'view' | 'edit' | 'password' = 'view';

  // Mock User Data
  user = {
    name: 'Chef Gordon',
    email: 'gordon@snapdough.com',
    phone: '(555) 123-4567',
    address: '42B Baker Street, Downtown, NY'
  };

  // Temporary object to hold changes before saving
  editUser = { ...this.user };

  // Password State
  oldPassword = '';
  newPassword = '';

  toggleMode(mode: 'view' | 'edit' | 'password') {
    this.viewMode = mode;
    if (mode === 'edit') {
      // Clone current data so canceling discards changes
      this.editUser = { ...this.user }; 
    }
  }

  saveProfile() {
    this.user = { ...this.editUser };
    this.viewMode = 'view';
    // TODO: Call your API to save changes here
    console.log('Profile Saved!', this.user);
  }

  updatePassword() {
    if (this.newPassword.length >= 6) {
      console.log('Password updated successfully!');
      this.viewMode = 'view';
      this.oldPassword = '';
      this.newPassword = '';
      // TODO: Call your password update API here
    } else {
      alert("Password must be at least 6 characters.");
    }
  }
}