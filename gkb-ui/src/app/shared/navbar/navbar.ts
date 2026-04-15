import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, 
    RouterLinkActive,
    NgbCollapseModule,
  OverlayModule,CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  
  // Mobile Menu State
  isMenuCollapsed = true;

  // Dropdown States (Pure Angular Control)
  isMenuDropdownOpen = false;
  isOrdersDropdownOpen = false;

  // Mock Authentication State
  isLoggedIn = true; // Set to false to see the Login button
  currentUser = {
    name: 'Chef Gordon',
    email: 'gordon@snapdough.com'
  };

  constructor(private eRef: ElementRef) {}

  // Closes the mobile menu and dropdowns when a link is clicked
  closeMenu() {
    this.isMenuCollapsed = true;
    this.isMenuDropdownOpen = false;
    this.isOrdersDropdownOpen = false;
  }

  // Toggles the Menu dropdown
  toggleMenuDropdown(event: Event) {
    event.stopPropagation();
    this.isMenuDropdownOpen = !this.isMenuDropdownOpen;
    this.isOrdersDropdownOpen = false; // Close the other one
  }

  // Toggles the Orders dropdown
  toggleOrdersDropdown(event: Event) {
    event.stopPropagation();
    this.isOrdersDropdownOpen = !this.isOrdersDropdownOpen;
    this.isMenuDropdownOpen = false; // Close the other one
  }

  // Listens for clicks anywhere on the page to close open dropdowns
  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuDropdownOpen = false;
      this.isOrdersDropdownOpen = false;
    }
  }

  // Mock Actions
  login() {
    console.log('Navigating to login...');
    this.closeMenu();
  }

  logout() {
    console.log('Logging out user...');
    this.isLoggedIn = false;
    this.closeMenu();
  }

  userprofile() {
    console.log('Navigating to profile...');
    this.closeMenu();
  }
}