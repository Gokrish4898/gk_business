import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { Loading } from '../../../shared/spinner/loading';

export interface Ingredient {
  stockname: string;
  quantity: number;
  unitomeasure: string;
}

export interface RecipeData {
  recipeid: number;
  recipename: string;
  ingredients: Ingredient[];
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
  allRecipes: RecipeData[] = [
    {
      recipeid: 201,
      recipename: 'Classic Chocolate Brownie',
      ingredients: [
        { stockname: 'Cocoa Powder', quantity: 50, unitomeasure: 'g' },
        { stockname: 'Granulated Sugar', quantity: 200, unitomeasure: 'g' },
        { stockname: 'Unsalted Butter', quantity: 100, unitomeasure: 'g' },
        { stockname: 'Fresh Eggs', quantity: 2, unitomeasure: 'pcs' },
        { stockname: 'All-Purpose Flour', quantity: 80, unitomeasure: 'g' }
      ]
    },
    {
      recipeid: 202,
      recipename: 'Red Velvet Cake Slice',
      ingredients: [
        { stockname: 'Cake Flour', quantity: 250, unitomeasure: 'g' },
        { stockname: 'Buttermilk', quantity: 240, unitomeasure: 'ml' },
        { stockname: 'Sugar', quantity: 300, unitomeasure: 'g' },
        { stockname: 'Cocoa Powder', quantity: 15, unitomeasure: 'g' },
        { stockname: 'Red Food Coloring', quantity: 10, unitomeasure: 'ml' }
      ]
    },
    {
      recipeid: 203,
      recipename: 'Artisan Sourdough Loaf',
      ingredients: [
        { stockname: 'Bread Flour', quantity: 500, unitomeasure: 'g' },
        { stockname: 'Water', quantity: 350, unitomeasure: 'ml' },
        { stockname: 'Active Sourdough Starter', quantity: 100, unitomeasure: 'g' },
        { stockname: 'Fine Sea Salt', quantity: 10, unitomeasure: 'g' }
      ]
    }
  ];

  // Pagination state
  pageSize = 5;
  pageIndex = 0;
  displayedRecipes: RecipeData[] = [];

  // Selection & Expansion state
  selectedRecipeId: number | null = null;
  expandedRecipeId: number | null = null;

  // Modal Dialog states
  isModalOpen = false;
  modalTitle = 'Add Recipe';
  modalRecipeName = '';
  modalIngredients: Ingredient[] = [];

  // Predefined lists of standard units
  availableUnits = ['g', 'kg', 'ml', 'l', 'pcs', 'tsp', 'tbsp', 'cup', 'pinch'];

  constructor(private loading: Loading) {}

  ngOnInit() {
    this.loading.showAndAutoHide();
    this.updateDisplayedRecipes();
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
      { stockname: '', quantity: 1, unitomeasure: 'g' }
    ];
    this.isModalOpen = true;
  }

  editRecipe() {
    if (this.selectedRecipeId) {
      const recipe = this.allRecipes.find(r => r.recipeid === this.selectedRecipeId);
      if (recipe) {
        this.modalTitle = 'Edit Recipe';
        this.modalRecipeName = recipe.recipename;
        // Deep copy ingredients
        this.modalIngredients = recipe.ingredients.map(ing => ({ ...ing }));
        this.isModalOpen = true;
      }
    }
  }

  addIngredientRow() {
    this.modalIngredients.push({ stockname: '', quantity: 1, unitomeasure: 'g' });
  }

  removeIngredientRow(index: number) {
    if (this.modalIngredients.length > 1) {
      this.modalIngredients.splice(index, 1);
    } else {
      this.modalIngredients[0] = { stockname: '', quantity: 1, unitomeasure: 'g' };
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitRecipe() {
    if (!this.modalRecipeName.trim()) return;

    // Filter out rows without a stockname
    const validIngredients = this.modalIngredients
      .filter(ing => ing.stockname && ing.stockname.trim())
      .map(ing => ({
        stockname: ing.stockname.trim(),
        quantity: Math.max(0.01, Number(ing.quantity || 0)),
        unitomeasure: ing.unitomeasure
      }));

    if (validIngredients.length === 0) {
      alert('Please define at least one valid ingredient with a name.');
      return;
    }

    if (this.modalTitle === 'Add Recipe') {
      const nextId = this.allRecipes.length > 0 ? Math.max(...this.allRecipes.map(r => r.recipeid)) + 1 : 201;
      const newRecipe: RecipeData = {
        recipeid: nextId,
        recipename: this.modalRecipeName.trim(),
        ingredients: validIngredients
      };
      this.allRecipes.push(newRecipe);
    } else if (this.modalTitle === 'Edit Recipe' && this.selectedRecipeId !== null) {
      const index = this.allRecipes.findIndex(r => r.recipeid === this.selectedRecipeId);
      if (index !== -1) {
        this.allRecipes[index] = {
          recipeid: this.selectedRecipeId,
          recipename: this.modalRecipeName.trim(),
          ingredients: validIngredients
        };
      }
    }

    this.updateDisplayedRecipes();
    this.closeModal();
    this.selectedRecipeId = null;
    this.expandedRecipeId = null;
  }
}
