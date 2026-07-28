import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { RatingService } from './rating-service';
import { ProductService } from '../products/product-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface RatingItem {
  userid: number;
  username: string;
  ratingstar: number;
  ratingcomment: string;
  createdon: string;
  active: number;
}

export interface Rating {
  ratingid: number;
  productid: number;
  ratingdetails: RatingItem[];
  createdon?: string;
  active: number;
}

@Component({
  selector: 'app-ratings',
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  standalone: true,
  templateUrl: './ratings.html',
  styleUrl: './ratings.scss',
})
export class Ratings implements OnInit {
  allRatings: Rating[] = [];
  productLookupMap: Map<number, string> = new Map();

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedRatings: Rating[] = [];

  // Selection & Expansion state
  selectedRatingId: number | null = null;
  expandedRatingId: number | null = null;

  constructor(
    private loading: Loading,
    private ratingService: RatingService,
    private productService: ProductService,
    private toastr: ToastService
  ) { }

  ngOnInit() {
    this._getproducts();
  }

  _getproducts() {
    this.loading.show();
    this.productService.getproduct().subscribe({
      next: (res) => {
        if (res.body != null && res.body.stocklst != null) {
          res.body.stocklst.forEach((p: any) => {
            const pid = p.productId ?? p.productid ?? p.ProductId;
            const pname = p.name ?? p.Name;
            this.productLookupMap.set(Number(pid), pname);
          });
        }
        this._getratings();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load products mapping info', 'error');
        this._getratings();
      }
    });
  }

  _getratings() {
    this.loading.show();
    this.ratingService.getrating().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          console.log('rating', res.body);
          this.allRatings = res.body.stocklst.map((r: any) => {
            let detailsRaw = r.ratingdetails ?? r.ratingDetails ?? r.RatingDetails;
            let detailsList: any[] = [];
            if (typeof detailsRaw === 'string') {
              try {
                detailsList = JSON.parse(detailsRaw);
              } catch (e) {
                detailsList = [];
              }
            } else if (Array.isArray(detailsRaw)) {
              detailsList = detailsRaw;
            }

            const normalizedDetails = detailsList.map((d: any) => ({
              userid: Number(d.userid ?? d.userId ?? d.UserId ?? 1),
              username: d.username ?? d.UserName ?? d.Username ?? 'Guest',
              ratingstar: Number(d.ratingstar ?? d.ratingStar ?? d.RatingStar ?? 5),
              ratingcomment: d.ratingcomment ?? d.ratingComment ?? d.RatingComment ?? '',
              createdon: d.createdon ?? d.createdOn ?? d.CreatedOn ?? new Date().toISOString(),
              active: Number(d.active ?? d.Active ?? 1)
            }));

            return {
              ratingid: r.ratingId ?? r.ratingid ?? r.RatingId,
              productid: r.productId ?? r.productid ?? r.ProductId,
              active: r.active ?? r.Active ?? 1,
              ratingdetails: normalizedDetails,
              createdon: r.createdon ?? r.createdOn ?? r.CreatedOn
            };
          });
          this.updateDisplayedRatings();
        }
        this.toastr.show('Ratings Loaded', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load ratings', 'error');
      }
    });
  }

  updateDisplayedRatings() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedRatings = this.allRatings.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedRatings();
  }

  selectRating(ratingid: number) {
    if (this.selectedRatingId === ratingid) {
      this.selectedRatingId = null;
      this.expandedRatingId = null;
    } else {
      this.selectedRatingId = ratingid;
      this.expandedRatingId = ratingid;
    }
  }

  toggleExpand(ratingid: number, event: Event) {
    event.stopPropagation();
    if (this.expandedRatingId === ratingid) {
      this.expandedRatingId = null;
    } else {
      this.expandedRatingId = ratingid;
    }
  }

  getProductName(productid: number): string {
    return this.productLookupMap.get(productid) || 'Unknown Product';
  }

  getAverageStars(ratingdetails: RatingItem[]): number {
    if (ratingdetails.length === 0) return 0;
    const sum = ratingdetails.reduce((acc, item) => acc + item.ratingstar, 0);
    return Math.round((sum / ratingdetails.length) * 10) / 10;
  }

  getArray(count: number): number[] {
    const rounded = Math.round(count);
    return Array(rounded > 0 ? rounded : 0).fill(0);
  }

  getEmptyStarsArray(count: number): number[] {
    const rounded = 5 - Math.round(count);
    return Array(rounded > 0 ? rounded : 0).fill(0);
  }

  toggleRatingVisibility(rating: Rating, activeStatus: number) {
    if (rating.active === activeStatus) return;

    const payload = {
      ratingId: rating.ratingid,
      productId: rating.productid,
      ratingDetails: rating.ratingdetails,
      active: activeStatus
    };

    this.loading.show();
    this.ratingService.editrating(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        rating.active = activeStatus;
        this.toastr.show('Rating visibility updated successfully', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to update rating visibility', 'error');
        this._getratings();
      }
    });
  }

  toggleReviewActiveStatus(rating: Rating, review: RatingItem, activeStatus: number) {
    if (review.active === activeStatus) return;

    review.active = activeStatus;

    const payload = {
      ratingId: rating.ratingid,
      productId: rating.productid,
      ratingDetails: rating.ratingdetails,
      active: rating.active
    };

    this.loading.show();
    this.ratingService.editrating(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        this.toastr.show('Review visibility updated successfully', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to update review visibility', 'error');
        this._getratings();
      }
    });
  }
}
