import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Loading } from '../shared/spinner/loading';
import { ProductService } from '../Admin/master/products/product-service';
import { RecipeService } from '../Admin/master/recipe/recipe-service';
import { StockService } from '../Admin/master/stock/stock-service';
import { ToastService } from '../shared/toaster/toast-service';

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
  
  isCalculated: boolean = false;
  customCost: number = 0;
  finalTotal: number = 0;

  @ViewChild('paymentModal') paymentModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private loading: Loading,
    private productService: ProductService,
    private recipeService: RecipeService,
    private stockService: StockService,
    private toastr: ToastService
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
    this.calculateCustomTotal(); // Calculate initial default formulation cost
  }

  onSliderChange() {
    // Whenever user modifies formulation sliders, calculation state resets to false (forces them to calculate again!)
    this.isCalculated = false;
  }

  calculateCustomTotal() {
    this.customCost = this.customizedIngredients.reduce((total, item) => {
      const itemCost = item.quantity * item.unitPrice;
      return total + itemCost;
    }, 0);

    // Apply decimal format
    this.customCost = Math.round(this.customCost * 100) / 100;
    this.isCalculated = true;
    this.toastr.show('Formulation price calculated successfully!', 'success');
  }

  goBack() {
    this.router.navigate(['/bdashboard']);
  }

  openPaymentModal() {
    if (!this.isCalculated) {
      this.toastr.show('Please calculate formulation price first!', 'error');
      return;
    }

    this.finalTotal = this.customCost;
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
