import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Loading } from '../shared/spinner/loading';
import { ProductService } from '../Admin/master/products/product-service';
import { RecipeService } from '../Admin/master/recipe/recipe-service';
import { StockService } from '../Admin/master/stock/stock-service';
import { AdditionalChargeService } from '../Admin/master/additionalcharge/additionalcharge-service';
import { ToastService } from '../shared/toaster/toast-service';
import { CartService } from '../cart/cart-service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss',
})
export class ProductDetails implements OnInit {
  productid: number = 0;
  productDetail: any = null;
  productRecipes: any[] = [];
  selectedRecipe: any = null;
  stockMap: Map<number, any> = new Map();
  customizedIngredients: any[] = [];
  
  // Custom formulation weight properties
  baseRecipeWeight: number = 0;
  currentCustomizedWeight: number = 0;

  get isWeightAllowed(): boolean {
    return this.currentCustomizedWeight <= this.baseRecipeWeight + 0.05;
  }

  get isWeightBalanced(): boolean {
    return Math.abs(this.currentCustomizedWeight - this.baseRecipeWeight) <= 0.05;
  }

  get isWeightUnder(): boolean {
    return this.currentCustomizedWeight < this.baseRecipeWeight - 0.05;
  }

  get isWeightOver(): boolean {
    return this.currentCustomizedWeight > this.baseRecipeWeight + 0.05;
  }

  get weightDifference(): number {
    return Math.round((this.baseRecipeWeight - this.currentCustomizedWeight) * 100) / 100;
  }
  
  isCalculated: boolean = false;
  customCost: number = 0;
  finalTotal: number = 0;

  allCharges: any[] = [];
  mappedCharges: any[] = [];
  totalHandlingCharges: number = 0;
  showHandlingCharges: boolean = false;

  @ViewChild('paymentModal') paymentModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private loading: Loading,
    private productService: ProductService,
    private recipeService: RecipeService,
    private stockService: StockService,
    private additionalChargeService: AdditionalChargeService,
    private toastr: ToastService,
    private cartService: CartService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.productid = Number(params.get('id'));
    });
  }

  ngOnInit(): void {
    this._loadData();
  }

  _loadData() {
    this.loading.show();
    // 1. Get stock details
    this.stockService.getstock().subscribe({
      next: (resStock) => {
        if (resStock.body != null && resStock.body.stocklst != null) {
          resStock.body.stocklst.forEach((s: any) => {
            const sid = s.stockId ?? s.stockid ?? s.StockId;
            this.stockMap.set(Number(sid), s);
          });
        }

        // 1.5 Get additional charges
        this.additionalChargeService.getcharge().subscribe({
          next: (resCharges) => {
            if (resCharges.body != null && resCharges.body.stocklst != null) {
              this.allCharges = resCharges.body.stocklst.map((c: any) => ({
                chargeId: c.chargeId ?? c.chargeid ?? c.ChargeId,
                chargeName: c.chargeName ?? c.charge_name ?? c.ChargeName,
                amount: c.amount ?? c.Amount,
                active: c.active ?? c.Active ?? 1
              }));
            }

            // 2. Get recipes list
            this.recipeService.getrecipe().subscribe({
              next: (resRecipe) => {
                let allRecipes: any[] = [];
                if (resRecipe.body != null && resRecipe.body.stocklst != null) {
                  allRecipes = resRecipe.body.stocklst;
                }

                // 3. Get product details
                this.productService.getproduct().subscribe({
                  next: (resProd) => {
                    this.loading.hide();
                    if (resProd.body != null && resProd.body.stocklst != null) {
                      this.productDetail = resProd.body.stocklst.find((p: any) => 
                        Number(p.productId ?? p.productid ?? p.ProductId) === this.productid
                      );

                      if (this.productDetail) {
                        // Extract mapped recipes for this product
                        let mappedIds: any[] = [];
                        let receipeidRaw = this.productDetail.receipeId ?? this.productDetail.receipeid ?? this.productDetail.ReceipeId;
                        if (typeof receipeidRaw === 'string') {
                          try { mappedIds = JSON.parse(receipeidRaw); } catch(e){}
                        } else if (Array.isArray(receipeidRaw)) {
                          mappedIds = receipeidRaw;
                        }

                        const recipeIds = mappedIds.map(r => Number(r.recipeid ?? r.recipeId ?? r));
                        
                        // Match full recipes details
                        this.productRecipes = allRecipes.filter(r => 
                          recipeIds.includes(Number(r.recipeId ?? r.recipeid ?? r.RecipeId))
                        );

                        // Extract mapped handling charges for this product
                        let mappedChargesRaw = this.productDetail.handlingCharge ?? this.productDetail.handlingcharge ?? this.productDetail.HandlingCharge;
                        let mappedChargesList: any[] = [];
                        if (typeof mappedChargesRaw === 'string') {
                          try { mappedChargesList = JSON.parse(mappedChargesRaw); } catch(e){}
                        } else if (Array.isArray(mappedChargesRaw)) {
                          mappedChargesList = mappedChargesRaw;
                        }

                        const handlingIds = mappedChargesList.map((h: any) => Number(h.charged ?? h.Charged ?? h));
                        this.mappedCharges = this.allCharges.filter(c => 
                          c.active === 1 && handlingIds.includes(Number(c.chargeId))
                        );

                        this.totalHandlingCharges = this.mappedCharges.reduce((acc, curr) => acc + Number(curr.amount), 0);
                        this.totalHandlingCharges = Math.round(this.totalHandlingCharges * 100) / 100;

                        // Select first recipe by default if available
                        if (this.productRecipes.length > 0) {
                          this.selectRecipe(this.productRecipes[0]);
                        }
                      }
                    }
                  },
                  error: () => {
                    this.loading.hide();
                    this.toastr.show('Failed to load product details', 'error');
                  }
                });
              },
              error: () => {
                this.loading.hide();
                this.toastr.show('Failed to load recipes details', 'error');
              }
            });
          },
          error: () => {
            this.loading.hide();
            this.toastr.show('Failed to load additional charges info', 'error');
          }
        });
      },
      error: () => {
        this.loading.hide();
        this.toastr.show('Failed to load stock inventory info', 'error');
      }
    });
  }

  selectRecipe(recipe: any) {
    this.selectedRecipe = recipe;
    this.isCalculated = false;

    let ingredientsRaw = recipe.ingredients ?? recipe.Ingredients;
    let list: any[] = [];
    if (typeof ingredientsRaw === 'string') {
      try { list = JSON.parse(ingredientsRaw); } catch(e){}
    } else if (Array.isArray(ingredientsRaw)) {
      list = ingredientsRaw;
    }

    // Map ingredients to stock
    this.customizedIngredients = list.map((ing: any) => {
      const stockId = Number(ing.stockId ?? ing.stockid ?? ing.StockId);
      const stockItem = this.stockMap.get(stockId) || {};
      
      const quantity = Number(ing.quantity ?? ing.Quantity ?? 0);
      const unitPrice = Number(stockItem.unitPrice ?? stockItem.unitprice ?? stockItem.UnitPrice ?? 0);
      const availability = Number(stockItem.availability ?? stockItem.Availability ?? 1000);
      const unit = stockItem.unit ?? ing.unitOfMeasure ?? 'g';

      return {
        stockId: stockId,
        name: ing.stackName ?? ing.stockName ?? stockItem.stockName ?? stockItem.stockname ?? 'Ingredient',
        quantity: quantity,
        originalQuantity: quantity,
        unitPrice: unitPrice,
        availability: availability,
        unit: unit,
        image: stockItem.imagelink ?? stockItem.imageLink ?? stockItem.ImageLink ?? 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      };
    });

    // Compute target base weight from base recipe ingredients
    this.baseRecipeWeight = list.reduce((total: number, ing: any) => {
      const qty = Number(ing.quantity ?? ing.Quantity ?? 0);
      const unit = ing.unitOfMeasure ?? ing.UnitOfMeasure ?? 'g';
      return total + this.convertToGrams(qty, unit);
    }, 0);

    this.updateCurrentWeight();
    this.calculateCustomTotal(); // Calculate initial default formulation cost
  }

  convertToGrams(quantity: number, unit: string): number {
    const u = (unit || '').toLowerCase().trim();
    if (u === 'kg' || u === 'kilograms' || u === 'kilogram') {
      return quantity * 1000;
    }
    if (u === 'l' || u === 'liters' || u === 'liter') {
      return quantity * 1000;
    }
    return quantity;
  }

  updateCurrentWeight() {
    this.currentCustomizedWeight = this.customizedIngredients.reduce((total, item) => {
      return total + this.convertToGrams(item.quantity, item.unit);
    }, 0);
  }

  onSliderChange() {
    // Whenever user modifies formulation sliders, calculation state resets to false (forces them to calculate again!)
    this.isCalculated = false;
    this.updateCurrentWeight();
  }

  calculateCustomTotal() {
    this.customCost = this.customizedIngredients.reduce((total, item) => {
      const itemCost = item.quantity * item.unitPrice;
      return total + itemCost;
    }, 0);

    // Apply decimal format
    this.customCost = Math.round(this.customCost * 100) / 100;
    this.finalTotal = Math.round((this.customCost + this.totalHandlingCharges) * 100) / 100;
    this.isCalculated = true;
    this.toastr.show('Formulation price calculated successfully!', 'success');
  }

  addToCart() {
    if (!this.isCalculated) return;

    if (!this.isWeightAllowed) {
      this.toastr.show(`Formulation weight must not exceed the target limit of ${this.baseRecipeWeight}g.`, 'error');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      this.toastr.show('Please login to place orders.', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.isCalculated) {
      this.toastr.show('Please calculate formulation price first!', 'error');
      return;
    }

    this.loading.show();

    // Map customized ingredients to the backend schema, including unit
    const details = this.customizedIngredients.map(ing => ({
      stockId: ing.stockId,
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit
    }));

    const priceDetails = {
      customCost: this.customCost,
      handlingCharges: this.totalHandlingCharges,
      totalPrice: this.finalTotal
    };

    const payload = {
      productId: this.productid,
      quantity: 1,
      recipeDetails: details,
      cartDetails: JSON.stringify(priceDetails)
    };

    this.cartService.addItemToCart(payload).subscribe({
      next: (res) => {
        this.loading.hide();
        this.toastr.show('Product added to cart successfully!', 'success');
        this.router.navigate(['/yourcart']);
      },
      error: (err) => {
        this.loading.hide();
        this.toastr.show(err.error?.error || 'Failed to add item to cart.', 'error');
      }
    });
  }

  goBack() {
    this.router.navigate(['/bdashboard']);
  }

  openPaymentModal() {
    if (!this.isCalculated) {
      this.toastr.show('Please calculate formulation price first!', 'error');
      return;
    }

    this.finalTotal = Math.round((this.customCost + this.totalHandlingCharges) * 100) / 100;
    this.modalService.open(this.paymentModal, {
      centered: true,
      windowClass: 'custom-modal-radius',
    });
  }

  processPayment(method: string, modal: any) {
    console.log(`User selected: ${method}`);
    modal.close('Payment Selected');
    this.toastr.show('Payment processed successfully!', 'success');
    this.router.navigate(['/bdashboard']);
  }

  onMouseMove(event: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);
  }

  onMouseLeave(card: HTMLElement) {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }
}
