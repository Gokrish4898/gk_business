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
isMenuCollapsed: boolean = true;
  
  // Auth & Menu State
  isLoggedIn: boolean = true; // Set to true to see the profile
  isProfileMenuOpen: boolean = false;

  constructor(private router : Router){

  }

  // Mock User Data
  currentUser = {
    name: 'Chef Gordon',
    email: 'gordon@snapdough.com',
    image: 'assets/default-avatar.png' // Add a path to a default image, or we'll use an icon fallback
  };

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeMenu() {
    this.isProfileMenuOpen = false;
    this.isMenuCollapsed = true; // Closes mobile menu too if open
  }

  login(){
    //  this.isLoggedIn = false;
    //  this.isProfileMenuOpen = true;
    this.isLoggedIn = true;

     this.router.navigate(["/login"]);
  }

  logout() {
    this.isLoggedIn = false;
    this.closeMenu();
    // TODO: Add actual logout logic here
  }
}
