import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { WishlistService } from './wishlist-service';
import { ProductService } from '../products/product-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface WishlistItem {
  productid: number;
  active: number;
  createdon: string;
}

export interface Wishlist {
  wishlistid: number;
  userid: number;
  wishlistdetails: WishlistItem[];
  createdon?: string;
  active: number;
}

@Component({
  selector: 'app-wishlists',
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  standalone: true,
  templateUrl: './wishlists.html',
  styleUrl: './wishlists.scss',
})
export class Wishlists implements OnInit {
  allWishlists: Wishlist[] = [];
  productLookupMap: Map<number, string> = new Map();

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedWishlists: Wishlist[] = [];

  // Selection & Expansion state
  selectedWishlistId: number | null = null;
  expandedWishlistId: number | null = null;

  constructor(
    private loading: Loading,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private toastr: ToastService
  ) {}

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
        this._getwishlists();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load products mapping info', 'error');
        this._getwishlists();
      }
    });
  }

  _getwishlists() {
    this.loading.show();
    this.wishlistService.getwishlist().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          this.allWishlists = res.body.stocklst.map((w: any) => {
            let detailsRaw = w.wishlistdetails ?? w.wishlistDetails ?? w.WishlistDetails;
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
              productid: Number(d.productid ?? d.productId ?? d.ProductId ?? d),
              active: Number(d.active ?? d.Active ?? 1),
              createdon: d.createdon ?? d.createdOn ?? d.CreatedOn ?? new Date().toISOString()
            }));

            return {
              wishlistid: w.wishlistId ?? w.wishlistid ?? w.WishlistId,
              userid: w.userId ?? w.userid ?? w.UserId,
              active: w.active ?? w.Active ?? 1,
              wishlistdetails: normalizedDetails,
              createdon: w.createdon ?? w.createdOn ?? w.CreatedOn
            };
          });
          this.updateDisplayedWishlists();
        }
        this.toastr.show('Wishlists Loaded', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load wishlists', 'error');
      }
    });
  }

  updateDisplayedWishlists() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedWishlists = this.allWishlists.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedWishlists();
  }

  selectWishlist(wishlistid: number) {
    if (this.selectedWishlistId === wishlistid) {
      this.selectedWishlistId = null;
      this.expandedWishlistId = null;
    } else {
      this.selectedWishlistId = wishlistid;
      this.expandedWishlistId = wishlistid;
    }
  }

  toggleExpand(wishlistid: number, event: Event) {
    event.stopPropagation();
    if (this.expandedWishlistId === wishlistid) {
      this.expandedWishlistId = null;
    } else {
      this.expandedWishlistId = wishlistid;
    }
  }

  getProductName(productid: number): string {
    return this.productLookupMap.get(productid) || 'Unknown Product';
  }

  toggleWishlistVisibility(wishlist: Wishlist, activeStatus: number) {
    if (wishlist.active === activeStatus) return;

    const payload = {
      wishlistId: wishlist.wishlistid,
      userId: wishlist.userid,
      wishlistDetails: wishlist.wishlistdetails,
      active: activeStatus
    };

    this.loading.show();
    this.wishlistService.editwishlist(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        wishlist.active = activeStatus;
        this.toastr.show('Wishlist visibility updated successfully', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to update wishlist visibility', 'error');
        this._getwishlists();
      }
    });
  }

  toggleItemActiveStatus(wishlist: Wishlist, item: WishlistItem, activeStatus: number) {
    if (item.active === activeStatus) return;

    item.active = activeStatus;

    const payload = {
      wishlistId: wishlist.wishlistid,
      userId: wishlist.userid,
      wishlistDetails: wishlist.wishlistdetails,
      active: wishlist.active
    };

    this.loading.show();
    this.wishlistService.editwishlist(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        this.toastr.show('Wishlist item status updated successfully', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to update wishlist item status', 'error');
        this._getwishlists();
      }
    });
  }
}
