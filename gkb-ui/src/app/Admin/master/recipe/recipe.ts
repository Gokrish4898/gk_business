import { Component, model, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';
import { RecipeService } from './recipe-service';
import { ToastService } from '../../../shared/toaster/toast-service';
import { StockService } from '../stock/stock-service';

export interface Ingredient {
  StockId: number;
  StackName?: string;
  Quantity: number;
  UnitOfMeasure: string;
}

export interface RecipeData {
  recipeid: number;
  recipename: string;
  ingredients: Ingredient[];
  active?: number;
  totalWeightInG?: number;
}

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule, RouterLink, MatPaginatorModule, FormsModule],
  templateUrl: './recipe.html',
  styleUrl: './recipe.scss',
})
export class Recipe implements OnInit {
  // Mock data representing standard schema fields
  // allRecipes: RecipeData[] = [
  //   {
  //     recipeid: 201,
  //     recipename: 'Classic Chocolate Brownie',
  //     ingredients: [
  //       { stockname: 'Cocoa Powder', quantity: 50, unitomeasure: 'g' },
  //       { stockname: 'Granulated Sugar', quantity: 200, unitomeasure: 'g' },
  //       { stockname: 'Unsalted Butter', quantity: 100, unitomeasure: 'g' },
  //       { stockname: 'Fresh Eggs', quantity: 2, unitomeasure: 'pcs' },
  //       { stockname: 'All-Purpose Flour', quantity: 80, unitomeasure: 'g' }
  //     ]
  //   },
  //   {
  //     recipeid: 202,
  //     recipename: 'Red Velvet Cake Slice',
  //     ingredients: [
  //       { stockname: 'Cake Flour', quantity: 250, unitomeasure: 'g' },
  //       { stockname: 'Buttermilk', quantity: 240, unitomeasure: 'ml' },
  //       { stockname: 'Sugar', quantity: 300, unitomeasure: 'g' },
  //       { stockname: 'Cocoa Powder', quantity: 15, unitomeasure: 'g' },
  //       { stockname: 'Red Food Coloring', quantity: 10, unitomeasure: 'ml' }
  //     ]
  //   },
  //   {
  //     recipeid: 203,
  //     recipename: 'Artisan Sourdough Loaf',
  //     ingredients: [
  //       { stockname: 'Bread Flour', quantity: 500, unitomeasure: 'g' },
  //       { stockname: 'Water', quantity: 350, unitomeasure: 'ml' },
  //       { stockname: 'Active Sourdough Starter', quantity: 100, unitomeasure: 'g' },
  //       { stockname: 'Fine Sea Salt', quantity: 10, unitomeasure: 'g' }
  //     ]
  //   }
  // ];
  allRecipes: RecipeData[] = [];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedRecipes: RecipeData[] = [];

  // Selection & Expansion state
  selectedRecipeId: number | null = null;
  expandedRecipeId: number | null = null;

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
  modalTitle = 'Add Recipe';
  modalRecipeName = '';
  modalIngredients: Ingredient[] = [];
  modalRecipeActive = 1;
  modalTotalWeightInG = 0;
  availableStocks: any = [];

  // Predefined lists of standard units
  availableUnits = ['g', 'kg', 'ml', 'l', 'pcs', 'tsp', 'tbsp', 'cup', 'pinch'];

  constructor(private loading: Loading, private recipeservice : RecipeService, private toastr : ToastService,
    private stockservice :StockService
  ) {}

  ngOnInit() {
    
    this._getrecipe();
    this._getstock();
    // this.loading.showAndAutoHide();
    // this.updateDisplayedRecipes();
  }

  updateDisplayedRecipes() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedRecipes = this.allRecipes.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedRecipes();
  }

  selectRecipe(recipeid: number) {
    if (this.selectedRecipeId === recipeid) {
      this.selectedRecipeId = null;
      this.expandedRecipeId = null; // collapse when deselected
    } else {
      this.selectedRecipeId = recipeid;
      this.expandedRecipeId = recipeid; // expand automatically on click
    }
  }

  toggleExpand(recipeid: number, event: Event) {
    event.stopPropagation(); // prevent row selection triggers
    if (this.expandedRecipeId === recipeid) {
      this.expandedRecipeId = null;
    } else {
      this.expandedRecipeId = recipeid;
    }
  }

  addRecipe() {
    this.modalTitle = 'Add Recipe';
    this.modalRecipeName = '';
    this.modalIngredients = [
      { StockId: 0, Quantity: 1, UnitOfMeasure: 'g' }
    ];
    this.modalRecipeActive = 1;
    this.modalTotalWeightInG = 0;
    this.isModalOpen = true;
  }

  editRecipe() {
    if (this.selectedRecipeId) {
      const recipe = this.allRecipes.find(r => r.recipeid === this.selectedRecipeId);
      if (recipe) {
        this.modalTitle = 'Edit Recipe';
        this.modalRecipeName = recipe.recipename;
        this.modalRecipeActive = recipe.active ?? 1;
        this.modalTotalWeightInG = recipe.totalWeightInG ?? 0;
        // Deep copy ingredients
        this.modalIngredients = recipe.ingredients.map(ing => ({ ...ing }));
        this.isModalOpen = true;
      }
    }
  }

  addIngredientRow() {
    this.modalIngredients.push({ StockId: 0, Quantity: 1, UnitOfMeasure: 'g' });
    this.onIngredientChange();
  }

  removeIngredientRow(index: number) {
    if (this.modalIngredients.length > 1) {
      this.modalIngredients.splice(index, 1);
    } else {
      this.modalIngredients[0] = { StockId: 0, Quantity: 1, UnitOfMeasure: 'g' };
    }
    this.onIngredientChange();
  }

  onIngredientChange() {
    let total = 0;
    this.modalIngredients.forEach(ing => {
      if (ing.StockId && ing.Quantity) {
        const qty = Number(ing.Quantity);
        const u = (ing.UnitOfMeasure || '').toLowerCase().trim();
        if (u === 'kg' || u === 'kilograms' || u === 'kilogram') {
          total += qty * 1000;
        } else if (u === 'l' || u === 'liters' || u === 'liter') {
          total += qty * 1000;
        } else {
          total += qty;
        }
      }
    });
    this.modalTotalWeightInG = total;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitRecipe() {
    debugger;
    if (!this.modalRecipeName.trim()) return;

    // Filter out rows without a stockname
    const validIngredients = this.modalIngredients
      .filter(ing => ing.StockId)
      .map(ing => {
        const stock = this.availableStocks.find((s: any) => s.stockId == ing.StockId);
        return {
          StockId: Number(ing.StockId),
          StackName: stock ? stock.stockName : '',
          Quantity: ing.Quantity,
          UnitOfMeasure: ing.UnitOfMeasure
        };
      });

    if (validIngredients.length === 0) {
      alert('Please define at least one valid ingredient with a name.');
      return;
    }

    if (this.modalTitle === 'Add Recipe') {
      const newRecipe = {
        recipeid: 0,
        recipename: this.modalRecipeName.trim(),
        ingredients: validIngredients,
        active: Number(this.modalRecipeActive),
        totalWeightInG: Number(this.modalTotalWeightInG)
      };
      this._addrecipe(newRecipe);
    } else if (this.modalTitle === 'Edit Recipe' && this.selectedRecipeId !== null) {
      const editedRecipe = {
        recipeid: this.selectedRecipeId,
        recipename: this.modalRecipeName.trim(),
        ingredients: validIngredients,
        active: Number(this.modalRecipeActive),
        totalWeightInG: Number(this.modalTotalWeightInG)
      };
      this._editrecipe(editedRecipe);
    }

    this.closeModal();
    this.selectedRecipeId = null;
    this.expandedRecipeId = null;
  }

  _addrecipe(newRecipe:any) {
      this.loading.show();
      this.recipeservice.addrecipe(newRecipe).subscribe({
        next: (res) => {
          this.loading.hide();
          if (res.body != null && res.body != null) {
            this.toastr.show('Stock Added Successfully', 'success');
          }
          this._getrecipe();
        },
        error: (res) => {
          this.loading.hide();
          this.toastr.show(res, 'error', 'top-left');
        },
      });
    }
    _editrecipe(editRecipe: any) {
      this.loading.show();
      this.recipeservice.editrecipe(editRecipe).subscribe({
        next: (res) => {
          this.loading.hide();
          if (res.body != null) {
            this.toastr.show(editRecipe.recipename + ' Recipe Updated Successfully', 'success');
          }
          this._getrecipe();
        },
        error: (res) => {
          this.loading.hide();
          this.toastr.show(res, 'error', 'top-left');
        },
      });
    }

    _getrecipe() {
    this.loading.show();
    this.recipeservice.getrecipe().subscribe({
      next: (res) => {
        this.loading.hide();

        // Ensure the response and the array actually exist
        if (res.body != null && res.body.stocklst != null) {
          this.allRecipes = res.body.stocklst.map((r: any) => {
            const recipeid = r.recipeId ?? r.recipeid ?? r.RecipeId;
            const recipename = r.recipeName ?? r.recipename ?? r.RecipeName;
            
            let ingredientsRaw = r.ingredients ?? r.Ingredients;
            let ingredientsList: Ingredient[] = [];
            if (typeof ingredientsRaw === 'string') {
              try {
                ingredientsList = JSON.parse(ingredientsRaw);
              } catch (e) {
                ingredientsList = [];
              }
            } else if (Array.isArray(ingredientsRaw)) {
              ingredientsList = ingredientsRaw;
            }

            const normalizedIngredients = ingredientsList.map((ing: any) => {
              return {
                StockId: ing.stockId ?? ing.StockId ?? ing.stockid,
                StackName: ing.stackName ?? ing.StackName ?? ing.stackname ?? ing.UnitOfMeasure ?? '',
                Quantity: ing.quantity ?? ing.Quantity,
                UnitOfMeasure: ing.unitOfMeasure ?? ing.UnitOfMeasure ?? ing.unitofmeasure
              };
            });

            return {
              recipeid,
              recipename,
              ingredients: normalizedIngredients,
              active: r.active ?? r.Active ?? 1,
              totalWeightInG: r.totalWeightInG ?? r.TotalWeightInG ?? r.totalweighting ?? r.totalWeighting ?? 0
            };
          });
          console.log("⚡ [recipe.ts] this.allRecipes normalized:", this.allRecipes);
          this.updateDisplayedRecipes();
        }
        this.toastr.show('Stock Loaded', 'success');
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show('Failed to load stock', 'error');
      },
    });
  }

  _getstock() {
    this.loading.show();
    this.stockservice.getstock().subscribe({
      next: (res) => {
        this.loading.hide();

        // Ensure the response and the array actually exist
        if (res.body != null && res.body.stocklst != null) {
          // FIX: Directly assign the array!
          // this.modalIngredients = [];
          // this.modalIngredients.push(res.body.stocklst)
          this.availableStocks = [...res.body.stocklst]

          // console.log('⚡ [LogPurge] [stock.ts:171] allStock:', this.allStock);
          // this.updateDisplayedStock();
        }
        // this.toastr.show('Stock Loaded', 'success');
      },
      error: (res) => {
        this.loading.hide();
        this.toastr.show('Failed to load stock', 'error');
      },
    });
  }
}
