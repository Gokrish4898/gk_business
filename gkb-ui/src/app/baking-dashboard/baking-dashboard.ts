import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Loading } from '../shared/spinner/loading';
import { ToastMessage, ToastService } from '../shared/toaster/toast-service';
// import '@angular/localize/init';

@Component({
  selector: 'app-baking-dashboard',
  imports: [CommonModule, NgbCarouselModule, MatPaginatorModule],
  standalone: true,
  templateUrl: './baking-dashboard.html',
  styleUrl: './baking-dashboard.scss',
})
export class BakingDashboard {
  slides = [
    {
      url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Fresh Croissants',
      description: 'Buttery layers of perfection.',
    },
    {
      url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      title: 'Artisan Bread',
      description: 'Sourdough starters aged to perfection.',
    },
  ];

  constructor(
    private router: Router,
    private loading: Loading,
    private toaster: ToastService,
  ) {}
  categories = [
    { name: 'All Items', icon: 'bi-camera-reels' },
    { name: 'Brownie', icon: 'bi-balloon-heart' },
    { name: 'Cakes', icon: 'bi-cake2' },
    { name: 'Breads', icon: 'bi-basket' },
    { name: 'Apple Pie', icon: 'bi-basket' },
  ];

  product = [
    {
      id: 1,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: true,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 2,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: true,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 3,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: true,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 4,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: false,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 5,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: true,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 6,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: false,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 7,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: true,
      rceipelst: {},
      totalrating: '20',
    },
    {
      id: 8,
      title: 'brownie',
      image:
        'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      rating: '4',
      wishlist: true,
      rceipelst: {},
      totalrating: '20',
    },
  ];

  categoryChunks: any[] = [];

  total_counter: number = 0;
  Reviews_counter: number = 0;
  customer_counter: number = 0;
  private interval: any;
  private interval_01: any;
  private interval_02: any;
  ngOnInit() {
    this.loading.showAndAutoHide();
    this.chunkCategories(4); // Group by 4 items per slide
    this.interval = setInterval(() => {
      this.total_counter++;
      this.Reviews_counter++;
      if (this.total_counter > 101) {
        clearInterval(this.interval);
      }
    }, 200);
    this.interval_01 = setInterval(() => {
      this.Reviews_counter++;
      if (this.Reviews_counter > 201) {
        clearInterval(this.interval_01);
      }
    }, 200);
    this.interval_02 = setInterval(() => {
      this.customer_counter++;
      if (this.customer_counter > 150) {
        clearInterval(this.interval_02);
      }
    }, 200);
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  chunkCategories(chunkSize: number) {
    for (let i = 0; i < this.categories.length; i += chunkSize) {
      this.categoryChunks.push(this.categories.slice(i, i + chunkSize));
    }
  }

  product_page(data: any) {
    this.router.navigate(['/productdetails/', data.id]);
  }

  addwhishlist(data: any) {
    console.log(data, 'data');

    data['wishlist'] = !data['wishlist'];
    if (data['wishlist']) {
      this.toaster.show('Wishlist added successfully', 'info', 'top-right');
    } else {
      this.toaster.show('Wishlist remove successfully', 'info', 'top-right');
    }
  }

  // Modal State
  isReviewsOpen: boolean = false;

  // Your existing item data
  item = {
    rating: 4.8,
    totalrating: 124
  };

  // Mock Reviews Data
  mockReviews = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      image: 'assets/user1.jpg', // Will fallback to icon if image fails/is missing
      date: 'Oct 12, 2023',
      rating: 5,
      comment: 'Absolutely phenomenal! The crust was perfectly crisp and the ingredients were super fresh. Will definitely order again.'
    },
    {
      id: 2,
      name: 'Mike R.',
      image: '', 
      date: 'Oct 10, 2023',
      rating: 4,
      comment: 'Really good flavor. Delivery was a little slow, but the food was still hot when it arrived.'
    },
    {
      id: 3,
      name: 'Elena Wood',
      image: '', 
      date: 'Sep 28, 2023',
      rating: 5,
      comment: 'Best I have had in the city. The gold accent branding is also a nice touch on the boxes!'
    }
  ];

  openReviewsModal() {
    this.isReviewsOpen = true;
    document.body.style.overflow = 'hidden'; // Prevents background scrolling
  }

  closeReviewsModal() {
    this.isReviewsOpen = false;
    document.body.style.overflow = 'auto'; // Restores background scrolling
  }

  // Helper function to easily generate stars in HTML
  getArray(count: number) {
    return new Array(count);
  }
}
