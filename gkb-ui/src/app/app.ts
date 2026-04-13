import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Login } from "./login/login";
import { Navbar } from "./shared/navbar/navbar";
import { Footer } from "./shared/footer/footer";
import { filter } from 'rxjs';
import { ViewportScroller ,AsyncPipe} from '@angular/common';
import { Loading } from './shared/spinner/loading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer,AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  // Pull-to-Refresh State
  startY: number = 0;
  pullDistance: number = 0;
  isRefreshing: boolean = false;
  readonly triggerDistance = 70; // Pixels needed to trigger refresh

  constructor(private router: Router, private viewportScroller: ViewportScroller, public loadingService : Loading) {}

  ngOnInit() {
    this.loadingService.hide();
    // 1. Global Scroll Reset on Page Change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
        const scrollableDiv = document.querySelector('.app-container');
        if (scrollableDiv) scrollableDiv.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 10);
    });
  }

  // --- PULL TO REFRESH LOGIC ---

  onTouchStart(event: TouchEvent | MouseEvent) {
    if (!this.scrollContainer) return;
    
    const container = this.scrollContainer.nativeElement;
    
    // Only start pulling if we are at the absolute top of the page
    if (container.scrollTop === 0 && !this.isRefreshing) {
      // Handle both mobile touch and desktop mouse clicks
      this.startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    } else {
      this.startY = 0; 
    }
  }

  onTouchMove(event: TouchEvent | MouseEvent) {
    if (this.startY > 0 && !this.isRefreshing) {
      const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      const diff = currentY - this.startY;

      // Only stretch if pulling DOWN
      if (diff > 0) {
        this.pullDistance = Math.min(diff * 0.4, 100); // 0.4 adds "rubber band" resistance
        if (event.cancelable) event.preventDefault(); 
      }
    }
  }

  onTouchEnd() {
    if (this.startY === 0) return; // Ignore if we never started a valid pull
    this.startY = 0; // Reset starting point

    if (this.pullDistance >= this.triggerDistance) {
      this.executeGlobalRefresh();
    } else {
      this.resetPull(); // Snap back if they didn't pull far enough
    }
  }

  executeGlobalRefresh() {
    this.isRefreshing = true;
    this.pullDistance = 60; // Hold the bubble in view while baking

    // Simulate the baking process, then reload the app
    setTimeout(() => {
      window.location.reload(); 
    }, 1500); // 1.5 seconds lets them see the cake rise!
  }

  resetPull() {
    this.pullDistance = 0;
    setTimeout(() => { this.isRefreshing = false; }, 300); 
  }
}