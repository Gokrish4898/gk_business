import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Loading } from '../shared/spinner/loading';
import { ToastMessage, ToastService } from '../shared/toaster/toast-service';
import { ProductService } from '../Admin/master/products/product-service';
import { WishlistService } from '../Admin/master/wishlists/wishlist-service';
import { RatingService } from '../Admin/master/ratings/rating-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-baking-dashboard',
  imports: [CommonModule, NgbCarouselModule, MatPaginatorModule, FormsModule],
  standalone: true,
  templateUrl: './baking-dashboard.html',
  styleUrl: './baking-dashboard.scss',
})
export class BakingDashboard implements OnInit, OnDestroy {
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

  categories = [
    { name: 'All Items', icon: 'bi-camera-reels' },
    { name: 'Brownie', icon: 'bi-balloon-heart' },
    { name: 'Cakes', icon: 'bi-cake2' },
    { name: 'Breads', icon: 'bi-basket' },
    { name: 'Apple Pie', icon: 'bi-basket' },
  ];

  allProducts: any[] = [];
  product: any[] = []; // Displayed products
  categoryChunks: any[] = [];
  userWishlist: any = null; // The User #1 Wishlist record
  ratingsList: any[] = []; // All ratings fetched from DB
  productRatingsMap: Map<number, { avg: number; count: number; reviews: any[] }> = new Map();

  // Review Modal State
  isReviewsOpen: boolean = false;
  selectedProduct: any = null;
  activeReviews: any[] = [];
  showHeartWink: boolean = false;

  // New review submission form state
  newRatingStar: number = 5;
  newRatingComment: string = '';

  constructor(
    private router: Router,
    private loading: Loading,
    private toaster: ToastService,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private ratingService: RatingService
  ) {}

  ngOnInit() {
    this.loading.show();
    this.chunkCategories(4);
    this._loadDashboardData();
  }

  ngOnDestroy(): void {}

  _loadDashboardData() {
    // 1. Fetch ratings first to compute stars & reviews
    this.ratingService.getrating().subscribe({
      next: (resRating) => {
        if (resRating.body != null && resRating.body.stocklst != null) {
          this.ratingsList = resRating.body.stocklst;
          this.productRatingsMap.clear();

          this.ratingsList.forEach((r: any) => {
            const pid = Number(r.productId ?? r.productid ?? r.ProductId);
            let details = r.ratingdetails ?? r.ratingDetails ?? r.RatingDetails;
            let list: any[] = [];
            if (typeof details === 'string') {
              try { list = JSON.parse(details); } catch (e) {}
            } else if (Array.isArray(details)) {
              list = details;
            }

            // Filter active reviews
            const activeReviews = list.filter((item: any) => Number(item.active ?? item.Active ?? 1) === 1);
            if (activeReviews.length > 0) {
              const totalStars = activeReviews.reduce((sum, item) => sum + Number(item.ratingstar ?? item.ratingStar ?? 5), 0);
              const avg = Math.round((totalStars / activeReviews.length) * 10) / 10;
              this.productRatingsMap.set(pid, {
                avg: avg,
                count: activeReviews.length,
                reviews: activeReviews.map((rev: any) => ({
                  id: rev.userid ?? 1,
                  name: `User #${rev.userid ?? 1}`,
                  rating: Number(rev.ratingstar ?? rev.ratingStar ?? 5),
                  comment: rev.ratingcomment ?? rev.ratingComment ?? '',
                  date: new Date(rev.createdon ?? rev.createdOn ?? new Date()).toLocaleDateString()
                }))
              });
            }
          });
        }
        this._loadWishlists();
      },
      error: () => this._loadWishlists()
    });
  }

  _loadWishlists() {
    // 2. Fetch Wishlists to see user's wishlist
    this.wishlistService.getwishlist().subscribe({
      next: (resWish) => {
        if (resWish.body != null && resWish.body.stocklst != null) {
          // Find wishlist for default User ID = 1
          this.userWishlist = resWish.body.stocklst.find((w: any) => Number(w.userId ?? w.userid ?? w.UserId) === 1);
        }
        this._loadProducts();
      },
      error: () => this._loadProducts()
    });
  }

  _loadProducts() {
    // 3. Fetch products and filter by stock availability
    this.productService.getproduct().subscribe({
      next: (resProd) => {
        this.loading.hide();
        if (resProd.body != null && resProd.body.stocklst != null) {
          const list = resProd.body.stocklst;
          this.allProducts = list.map((p: any) => {
            const pid = Number(p.productId ?? p.productid ?? p.ProductId);
            const inStock = p.inStock ?? p.instock ?? p.InStock ?? false;
            
            // Check if product is in wishlist
            let inWish = false;
            if (this.userWishlist) {
              let details = this.userWishlist.wishlistdetails ?? this.userWishlist.wishlistDetails ?? this.userWishlist.WishlistDetails;
              let items: any[] = [];
              if (typeof details === 'string') {
                try { items = JSON.parse(details); } catch(e){}
              } else if (Array.isArray(details)) {
                items = details;
              }
              const item = items.find((itm: any) => Number(itm.productid ?? itm.productId ?? itm.ProductId) === pid);
              inWish = item ? Number(item.active ?? item.Active ?? 1) === 1 : false;
            }

            // Get rating info
            const ratingInfo = this.productRatingsMap.get(pid) || { avg: 4, count: 0, reviews: [] };

            return {
              id: pid,
              title: p.name ?? p.Name,
              image: p.imagelink || p.imageLink || p.ImageLink || 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
              rating: ratingInfo.avg.toString(),
              wishlist: inWish,
              totalrating: ratingInfo.count.toString(),
              instock: inStock
            };
          });

          // Rule: Show ONLY products where stock is available (InStock == true)
          this.product = this.allProducts.filter(p => p.instock === true);
        }
      },
      error: () => {
        this.loading.hide();
        this.toaster.show('Failed to load products', 'error');
      }
    });
  }

  chunkCategories(chunkSize: number) {
    for (let i = 0; i < this.categories.length; i += chunkSize) {
      this.categoryChunks.push(this.categories.slice(i, i + chunkSize));
    }
  }

  onMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 12; // rotate up to 12deg
    const rotateY = ((x - centerX) / centerX) * 12; // rotate up to 12deg
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
  }

  onMouseLeave(card: HTMLElement) {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }

  product_page(data: any) {
    this.router.navigate(['/productdetails/', data.id]);
  }

  triggerHeartWink() {
    this.showHeartWink = true;
    setTimeout(() => {
      this.showHeartWink = false;
    }, 1800);
  }

  addwhishlist(data: any) {
    // Toggle locally
    data['wishlist'] = !data['wishlist'];
    
    this.loading.show();
    if (this.userWishlist) {
      // Modify existing wishlist details
      let details = this.userWishlist.wishlistdetails ?? this.userWishlist.wishlistDetails ?? this.userWishlist.WishlistDetails;
      let items: any[] = [];
      if (typeof details === 'string') {
        try { items = JSON.parse(details); } catch(e){}
      } else if (Array.isArray(details)) {
        items = details;
      }

      const itemIndex = items.findIndex((itm: any) => Number(itm.productid ?? itm.productId ?? itm.ProductId) === data.id);
      if (itemIndex !== -1) {
        items[itemIndex].active = data.wishlist ? 1 : 0;
      } else {
        items.push({
          productid: data.id,
          active: 1,
          createdon: new Date().toISOString()
        });
      }

      const payload = {
        wishlistId: this.userWishlist.wishlistId ?? this.userWishlist.wishlistid ?? this.userWishlist.WishlistId,
        userId: 1,
        wishlistDetails: items,
        active: 1
      };

      this.wishlistService.editwishlist(payload).subscribe({
        next: (res) => {
          this.loading.hide();
          this.userWishlist = res.body;
          if (data.wishlist) {
            this.triggerHeartWink();
          } else {
            this.toaster.show('Removed from wishlist', 'info', 'top-right');
          }
        },
        error: () => {
          this.loading.hide();
          data['wishlist'] = !data['wishlist']; // rollback
          this.toaster.show('Failed to update wishlist', 'error');
        }
      });
    } else {
      // Create new wishlist
      const newItems = [{
        productid: data.id,
        active: 1,
        createdon: new Date().toISOString()
      }];

      const payload = {
        wishlistId: 0,
        userId: 1,
        wishlistDetails: newItems,
        active: 1
      };

      this.wishlistService.addwishlist(payload).subscribe({
        next: (res) => {
          this.loading.hide();
          this.userWishlist = res.body;
          if (data.wishlist) {
            this.triggerHeartWink();
          } else {
            this.toaster.show('Added to wishlist', 'info', 'top-right');
          }
        },
        error: () => {
          this.loading.hide();
          data['wishlist'] = !data['wishlist']; // rollback
          this.toaster.show('Failed to create wishlist', 'error');
        }
      });
    }
  }

  openReviewsModal(item: any) {
    this.selectedProduct = item;
    const info = this.productRatingsMap.get(item.id) || { avg: 4, count: 0, reviews: [] };
    this.activeReviews = info.reviews;
    this.newRatingStar = 5;
    this.newRatingComment = '';
    this.isReviewsOpen = true;
    document.body.style.overflow = 'hidden'; // Prevents background scrolling
  }

  closeReviewsModal() {
    this.isReviewsOpen = false;
    document.body.style.overflow = 'auto'; // Restores background scrolling
  }

  submitNewReview() {
    if (!this.selectedProduct) return;

    this.loading.show();

    // Check if there is already a rating object for this product
    const existingRating = this.ratingsList.find((r: any) => Number(r.productId ?? r.productid ?? r.ProductId) === this.selectedProduct.id);

    const newReviewItem = {
      userid: 1, // Default user
      ratingstar: this.newRatingStar,
      ratingcomment: this.newRatingComment.trim(),
      createdon: new Date().toISOString(),
      active: 1
    };

    if (existingRating) {
      let details = existingRating.ratingdetails ?? existingRating.ratingDetails ?? existingRating.RatingDetails;
      let reviewsList: any[] = [];
      if (typeof details === 'string') {
        try { reviewsList = JSON.parse(details); } catch(e){}
      } else if (Array.isArray(details)) {
        reviewsList = details;
      }

      reviewsList.push(newReviewItem);

      const payload = {
        ratingId: existingRating.ratingId ?? existingRating.ratingid ?? existingRating.RatingId,
        productId: this.selectedProduct.id,
        ratingDetails: reviewsList,
        active: 1
      };

      this.ratingService.editrating(payload).subscribe({
        next: () => {
          this.toaster.show('Review submitted successfully!', 'success');
          this._loadDashboardData();
          this.closeReviewsModal();
        },
        error: () => {
          this.loading.hide();
          this.toaster.show('Failed to submit review', 'error');
        }
      });
    } else {
      // Create new rating record
      const payload = {
        ratingId: 0,
        productId: this.selectedProduct.id,
        ratingDetails: [newReviewItem],
        active: 1
      };

      this.ratingService.addrating(payload).subscribe({
        next: () => {
          this.toaster.show('Review submitted successfully!', 'success');
          this._loadDashboardData();
          this.closeReviewsModal();
        },
        error: () => {
          this.loading.hide();
          this.toaster.show('Failed to submit review', 'error');
        }
      });
    }
  }

  getArray(count: number) {
    return Array(Math.round(count)).fill(0);
  }
}
