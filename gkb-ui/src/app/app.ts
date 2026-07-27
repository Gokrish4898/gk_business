import { Component, ElementRef, OnInit, OnDestroy, signal, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Login } from './login/login';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { filter } from 'rxjs';
import { ViewportScroller, AsyncPipe, CommonModule } from '@angular/common';
import { Loading } from './shared/spinner/loading';
import { ToastService } from './shared/toaster/toast-service';
import { Maintenance } from './shared/maintenance/maintenance';
import { maintenanceService } from './shared/maintenance/maintenance-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, Footer, AsyncPipe, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  // Side doodles state
  activeDoodles: any[] = [];
  private doodleIdCounter = 0;
  private doodleIntervalId: any;
  private doodleTypes = ['whisk', 'hat', 'cupcake', 'cookie', 'rollingpin', 'croissant', 'pretzel', 'pie'];

  // Pull-to-Refresh State
  // startY: number = 0;
  // pullDistance: number = 0;
  // isRefreshing: boolean = false;
  // readonly triggerDistance = 30; // Pixels needed to trigger refresh

  constructor(
    private maintenanceeservices: maintenanceService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    public loadingService: Loading,
    public toastService: ToastService,
  ) { }

  ngOnInit() {
    this.maintenanceeservices.setmaintenance(false);
    this.loadingService.hide();
    // 1. Global Scroll Reset on Page Change
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
        const scrollableDiv = document.querySelector('.app-container');
        if (scrollableDiv) scrollableDiv.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 10);
    });
    this.startDoodles();
  }

  ngOnDestroy(): void {
    this.stopDoodles();
  }

  startDoodles() {
    if (typeof window === 'undefined') return;
    this.spawnDoodle();
    this.doodleIntervalId = setInterval(() => {
      this.spawnDoodle();
    }, 600);
  }

  stopDoodles() {
    if (this.doodleIntervalId) {
      clearInterval(this.doodleIntervalId);
    }
  }

  spawnDoodle() {
    if (typeof window === 'undefined' || window.innerWidth <= 1480) {
      if (this.activeDoodles.length > 0) {
        this.activeDoodles = [];
      }
      return;
    }

    const side = Math.random() > 0.5 ? 'left' : 'right';
    const type = this.doodleTypes[Math.floor(Math.random() * this.doodleTypes.length)];
    const id = this.doodleIdCounter++;

    const leftVal = Math.random() * 85 + 5; // 5% to 90% of the side margin width
    const topVal = Math.random() * 75 + 10; // 10% to 85% of screen height
    const scale = Math.random() * 0.35 + 0.75; // 0.75 to 1.1 scale
    const rotation = Math.random() * 80 - 40; // -40deg to 40deg
    const delay = Math.random() * 0.5; // 0s to 0.5s stagger delay
    const duration = Math.random() * 2 + 5; // 5s to 7s animation duration

    const newDoodle = {
      id,
      type,
      side,
      left: `${leftVal}%`,
      top: `${topVal}%`,
      scale,
      rotation,
      delay: `${delay}s`,
      duration: `${duration}s`
    };

    this.activeDoodles.push(newDoodle);

    if (this.activeDoodles.length > 1005) {
      this.activeDoodles.shift();
    }

    // Auto cleanup
    setTimeout(() => {
      this.activeDoodles = this.activeDoodles.filter(d => d.id !== id);
    }, (duration + delay) * 1000 + 200);
  }

  // --- PULL TO REFRESH LOGIC ---

  // onTouchStart(event: TouchEvent | MouseEvent) {
  //   if (!this.scrollContainer) return;
  // 
  //   const container = this.scrollContainer.nativeElement;
  // 
  //   // Only start pulling if we are at the absolute top of the page
  //   if (container.scrollTop === 0 && !this.isRefreshing) {
  //     // Handle both mobile touch and desktop mouse clicks
  //     this.startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  //   } else {
  //     this.startY = 0;
  //   }
  // }
  // 
  // onTouchMove(event: TouchEvent | MouseEvent) {
  //   if (this.startY > 0 && !this.isRefreshing) {
  //     const currentY = 'touches' in event ? event.touches[0].clientY : event.clientY;
  //     const diff = currentY - this.startY;
  // 
  //     // Only stretch if pulling DOWN
  //     if (diff > 0) {
  //       this.pullDistance = Math.min(diff * 0.4, 100); // 0.4 adds "rubber band" resistance
  //       if (event.cancelable) event.preventDefault();
  //     }
  //   }
  // }
  // 
  // onTouchEnd() {
  //   if (this.startY === 0) return; // Ignore if we never started a valid pull
  //   this.startY = 0; // Reset starting point
  // 
  //   if (this.pullDistance >= this.triggerDistance) {
  //     this.executeGlobalRefresh();
  //   } else {
  //     this.resetPull(); // Snap back if they didn't pull far enough
  //   }
  // }
  // 
  // executeGlobalRefresh() {
  //   this.isRefreshing = true;
  //   this.pullDistance = 90; // Hold the bubble in view while baking
  // 
  //   // Simulate the baking process, then reload the app
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1500); // 1.5 seconds lets them see the cake rise!
  // }
  // 
  // resetPull() {
  //   this.pullDistance = 0;
  //   setTimeout(() => {
  //     this.isRefreshing = false;
  //   }, 300);
  // }
}
