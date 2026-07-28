import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { ProductService } from './product-service';
import { RecipeService } from '../recipe/recipe-service';
import { AdditionalChargeService } from '../additionalcharge/additionalcharge-service';
import { ToastService } from '../../../shared/toaster/toast-service';

export interface ProductRecipe {
  recipeid: number;
}

export interface ProductHandlingCharge {
  charged: number;
}

export interface Product {
  productid: number;
  name: string;
  delivery: number;
  price: number;
  instock: boolean;
  receipeid: ProductRecipe[];
  handlingcharge: ProductHandlingCharge[];
  active?: number;
  imagelink?: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  standalone: true,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  allProducts: Product[] = [];
  allRecipes: any[] = [];
  allAdditionalCharges: any[] = [];
  recipeLookupMap: Map<number, string> = new Map();
  chargeLookupMap: Map<number, any> = new Map();

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedProducts: Product[] = [];

  // Selection & Expansion state
  selectedProductId: number | null = null;
  expandedProductId: number | null = null;

  // Modal Dialog states
  private _isModalOpen = false;
  get isModalOpen(): boolean {
    return this._isModalOpen;
  }
  set isModalOpen(value: boolean) {
    this._isModalOpen = value;
    if (typeof document !== 'undefined') {
      if (value) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }
  modalTitle = 'Add Product';
  modalProduct: {
    productid?: number;
    name: string;
    delivery: number;
    price: number;
    instock: boolean;
    receipeid: ProductRecipe[];
    handlingcharge: ProductHandlingCharge[];
    imagelink: string;
    active: number;
  } = {
    name: '',
    delivery: 1,
    price: 0,
    instock: true,
    receipeid: [{ recipeid: 0 }],
    handlingcharge: [{ charged: 0 }],
    imagelink: '',
    active: 1
  };

  constructor(
    private loading: Loading,
    private productservice: ProductService,
    private recipeservice: RecipeService,
    private additionalchargeservice: AdditionalChargeService,
    private toastr: ToastService
  ) {}

  ngOnInit() {
    this._getadditionalcharges();
  }

  _getadditionalcharges() {
    this.loading.show();
    this.additionalchargeservice.getcharge().subscribe({
      next: (res) => {
        if (res.body != null && res.body.stocklst != null) {
          this.allAdditionalCharges = res.body.stocklst.map((c: any) => ({
            chargeId: c.chargeId ?? c.chargeid ?? c.ChargeId,
            chargeName: c.chargeName ?? c.charge_name ?? c.ChargeName,
            amount: c.amount ?? c.Amount
          }));
          this.chargeLookupMap.clear();
          this.allAdditionalCharges.forEach(ch => {
            this.chargeLookupMap.set(ch.chargeId, ch);
          });
        }
        this._getrecipes();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load handling charges', 'error');
        this._getrecipes();
      }
    });
  }

  _getrecipes() {
    this.loading.show();
    this.recipeservice.getrecipe().subscribe({
      next: (res) => {
        if (res.body != null && res.body.stocklst != null) {
          this.allRecipes = res.body.stocklst.map((r: any) => ({
            recipeid: r.recipeId ?? r.recipeid ?? r.RecipeId,
            recipename: r.recipeName ?? r.recipename ?? r.RecipeName
          }));

          this.recipeLookupMap.clear();
          this.allRecipes.forEach(r => {
            this.recipeLookupMap.set(r.recipeid, r.recipename);
          });
        }
        this._getproducts();
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load recipes', 'error');
        this._getproducts();
      }
    });
  }

  _getproducts() {
    this.loading.show();
    this.productservice.getproduct().subscribe({
      next: (res) => {
        this.loading.hide();
        if (res.body != null && res.body.stocklst != null) {
          this.allProducts = res.body.stocklst.map((p: any) => {
            let receipeidRaw = p.receipeId ?? p.receipeid ?? p.ReceipeId;
            let receipeidList: any[] = [];
            if (typeof receipeidRaw === 'string') {
              try {
                receipeidList = JSON.parse(receipeidRaw);
              } catch (e) {
                receipeidList = [];
              }
            } else if (Array.isArray(receipeidRaw)) {
              receipeidList = receipeidRaw;
            }

            const normalizedRecipes = receipeidList.map((r: any) => ({
              recipeid: Number(r.recipeid ?? r.recipeId ?? r.RecipeId ?? r)
            }));

            let hcRaw = p.handlingCharge ?? p.handlingcharge ?? p.HandlingCharge;
            let hcList: any[] = [];
            if (typeof hcRaw === 'string') {
              try {
                hcList = JSON.parse(hcRaw);
              } catch (e) {
                hcList = [];
              }
            } else if (Array.isArray(hcRaw)) {
              hcList = hcRaw;
            }

            const normalizedCharges = hcList.map((h: any) => ({
              charged: Number(h.charged ?? h.Charged ?? h)
            }));

            return {
              productid: p.productId ?? p.productid ?? p.ProductId,
              name: p.name ?? p.Name,
              delivery: p.delivery ?? p.Delivery ?? 0,
              price: p.price ?? p.Price ?? 0,
              instock: p.inStock ?? p.instock ?? p.InStock ?? false,
              receipeid: normalizedRecipes,
              handlingcharge: normalizedCharges,
              active: p.active ?? p.Active ?? 1,
              imagelink: p.imageLink ?? p.imagelink ?? p.ImageLink ?? ''
            };
          });
          this.updateDisplayedProducts();
        }
        this.toastr.show('Products Loaded', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to load products', 'error');
      }
    });
  }

  updateDisplayedProducts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedProducts();
  }

  selectProduct(productId: number) {
    if (this.selectedProductId === productId) {
      this.selectedProductId = null;
      this.expandedProductId = null;
    } else {
      this.selectedProductId = productId;
      this.expandedProductId = productId;
    }
  }

  toggleExpand(productId: number, event: Event) {
    event.stopPropagation();
    if (this.expandedProductId === productId) {
      this.expandedProductId = null;
    } else {
      this.expandedProductId = productId;
    }
  }

  getRecipeName(recipeid: number): string {
    return this.recipeLookupMap.get(recipeid) || 'Unknown Recipe';
  }

  addProduct() {
    this.modalTitle = 'Add Product';
    this.modalProduct = {
      name: '',
      delivery: 1,
      price: 0,
      instock: true,
      receipeid: [{ recipeid: 0 }],
      handlingcharge: [{ charged: 0 }],
      imagelink: '',
      active: 1
    };
    this.isModalOpen = true;
  }

  editProduct() {
    if (this.selectedProductId) {
      const prod = this.allProducts.find(p => p.productid === this.selectedProductId);
      if (prod) {
        this.modalTitle = 'Edit Product';
        this.modalProduct = {
          productid: prod.productid,
          name: prod.name,
          delivery: prod.delivery,
          price: prod.price,
          instock: prod.instock,
          receipeid: prod.receipeid.map(r => ({ ...r })),
          handlingcharge: prod.handlingcharge.map(h => ({ ...h })),
          imagelink: prod.imagelink || '',
          active: prod.active ?? 1
        };
        if (this.modalProduct.receipeid.length === 0) {
          this.modalProduct.receipeid.push({ recipeid: 0 });
        }
        if (this.modalProduct.handlingcharge.length === 0) {
          this.modalProduct.handlingcharge.push({ charged: 0 });
        }
        this.isModalOpen = true;
      }
    }
  }

  toggleStockStatus(product: Product, inStock: boolean) {
    if (product.instock === inStock) return;

    const payload = {
      productId: product.productid,
      name: product.name,
      delivery: product.delivery,
      price: product.price,
      inStock: inStock,
      imageLink: product.imagelink,
      receipeId: product.receipeid
    };

    this.loading.show();
    this.productservice.editproduct(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        product.instock = inStock;
        this.toastr.show(product.name + ' availability updated successfully', 'success');
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show('Failed to update product availability', 'error');
        this._getproducts();
      }
    });
  }

  addRecipeRow() {
    this.modalProduct.receipeid.push({ recipeid: 0 });
  }

  removeRecipeRow(index: number) {
    if (this.modalProduct.receipeid.length > 1) {
      this.modalProduct.receipeid.splice(index, 1);
    } else {
      this.modalProduct.receipeid[0] = { recipeid: 0 };
    }
  }

  addHandlingChargeRow() {
    this.modalProduct.handlingcharge.push({ charged: 0 });
  }

  removeHandlingChargeRow(index: number) {
    if (this.modalProduct.handlingcharge.length > 1) {
      this.modalProduct.handlingcharge.splice(index, 1);
    } else {
      this.modalProduct.handlingcharge[0] = { charged: 0 };
    }
  }

  getHandlingChargeName(chargeid: number): string {
    return this.chargeLookupMap.get(chargeid)?.chargeName || 'Unknown Charge';
  }

  getHandlingChargeAmount(chargeid: number): number {
    return this.chargeLookupMap.get(chargeid)?.amount || 0;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitProduct() {
    if (!this.modalProduct.name.trim()) return;

    const validRecipes = this.modalProduct.receipeid
      .filter(r => r.recipeid > 0)
      .map(r => ({
        recipeid: Number(r.recipeid)
      }));

    const validCharges = this.modalProduct.handlingcharge
      .filter(h => h.charged > 0)
      .map(h => ({
        charged: Number(h.charged)
      }));

    const payload = {
      productId: this.modalTitle === 'Edit Product' ? this.selectedProductId : 0,
      name: this.modalProduct.name.trim(),
      delivery: Number(this.modalProduct.delivery),
      price: Number(this.modalProduct.price),
      inStock: this.modalProduct.instock,
      imageLink: this.modalProduct.imagelink.trim(),
      receipeId: validRecipes,
      handlingCharge: validCharges,
      active: Number(this.modalProduct.active)
    };

    this.loading.show();
    if (this.modalTitle === 'Add Product') {
      this.productservice.addproduct(payload).subscribe({
        next: (res) => {
          this.loading.hide();
          this.toastr.show('Product Added Successfully', 'success');
          this._getproducts();
        },
        error: (err) => {
          this.loading.hide();
          this.toastr.show('Failed to add product', 'error');
        }
      });
    } else {
      this.productservice.editproduct(payload).subscribe({
        next: (res) => {
          this.loading.hide();
          this.toastr.show('Product Updated Successfully', 'success');
          this._getproducts();
        },
        error: (err) => {
          this.loading.hide();
          this.toastr.show('Failed to update product', 'error');
        }
      });
    }
    this.closeModal();
    this.selectedProductId = null;
    this.expandedProductId = null;
  }
}
