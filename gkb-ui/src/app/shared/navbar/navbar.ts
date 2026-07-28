import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from '../../login/login-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, 
    RouterLinkActive,
    NgbCollapseModule,
    OverlayModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  
  // Mobile Menu State
  isMenuCollapsed = true;

  // Dropdown States (Pure Angular Control)
  isMenuDropdownOpen = false;
  isOrdersDropdownOpen = false;

  // Authentication State
  get isLoggedIn(): boolean {
    return this.loginService.userid() > 0;
  }

  get currentUser() {
    return {
      name: this.loginService.username(),
      email: this.loginService.useremail()
    };
  }

  loginService = inject(LoginService);
  private router = inject(Router);

  constructor(private eRef: ElementRef) {
    this.checkLoginStatus();
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      const storedRoleId = localStorage.getItem('roleId');
      const storedUsername = localStorage.getItem('username');
      const storedEmail = localStorage.getItem('email');
      
      if (storedUserId) {
        this.loginService.userid.set(Number(storedUserId));
      }
      if (storedRoleId) {
        this.loginService.roleid.set(Number(storedRoleId));
      }
      if (storedUsername) {
        this.loginService.username.set(storedUsername);
      }
      if (storedEmail) {
        this.loginService.useremail.set(storedEmail);
      }
    }
  }

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

  // Actions
  login() {
    this.closeMenu();
  }

  logout() {
    console.log('Logging out user...');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('roleId');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    }
    this.loginService.userid.set(0);
    this.loginService.roleid.set(0);
    this.loginService.username.set('');
    this.loginService.useremail.set('');
    this.closeMenu();
    this.router.navigate(['/login']);
  }

  userprofile() {
    console.log('Navigating to profile...');
    this.closeMenu();
    this.router.navigate(['/userprofile']);
  }
}