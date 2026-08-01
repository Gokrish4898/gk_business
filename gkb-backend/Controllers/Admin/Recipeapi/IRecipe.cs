using gkb_service.Models;
using snapdough_api.Data;
using Microsoft.EntityFrameworkCore;

namespace gkb_service.Controllers.Admin
{
    public interface IRecipe
    {
        public Task<Models.Recipe> AddRecipe(Models.Recipe recipe);
        public Task<List<Models.Recipe>> GetRecipe();
        public Task<Models.Recipe> EditRecipe(Models.Recipe recipe, CancellationToken cancellationToken);
    }

    public class RecipeService : IRecipe
    {
        private readonly AppDbContext _db;
        public RecipeService(AppDbContext db)
        {
            _db = db;
        }
        private float CalculateTotalWeightInG(List<gkb_service.Model.RecipeIngredient>? ingredients)
        {
            if (ingredients == null) return 0f;
            float total = 0f;
            foreach (var ing in ingredients)
            {
                float qty = (float)ing.Quantity;
                string unit = (ing.UnitOfMeasure ?? "").ToLower().Trim();

                if (unit == "kg" || unit == "kilograms" || unit == "kilogram")
                {
                    total += qty * 1000f;
                }
                else if (unit == "l" || unit == "liters" || unit == "liter")
                {
                    total += qty * 1000f;
                }
                else
                {
                    // g, grams, gram, ml, milliliters, milliliter, pcs, pieces, etc.
                    total += qty;
                }
            }
            return total;
        }

        public async Task<Models.Recipe> AddRecipe(Models.Recipe recipe)
        {
            try
            {
                if (recipe.TotalWeightInG == null || recipe.TotalWeightInG <= 0)
                {
                    recipe.TotalWeightInG = CalculateTotalWeightInG(recipe.Ingredients);
                }
                await _db.Recipes.AddAsync(recipe);
                await _db.SaveChangesAsync();
                return recipe;
            }catch(Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }

        public async Task<Models.Recipe> EditRecipe(Models.Recipe recipe, CancellationToken cancellationToken)
        {
            var availablerecipe = await _db.Recipes.FirstOrDefaultAsync(s => s.RecipeId == recipe.RecipeId, cancellationToken);
            if (availablerecipe == null)
            {
                return null;
            }
            availablerecipe.RecipeName = recipe.RecipeName;
            availablerecipe.Ingredients = recipe.Ingredients;
            availablerecipe.TotalWeightInG = (recipe.TotalWeightInG != null && recipe.TotalWeightInG > 0) ? recipe.TotalWeightInG : CalculateTotalWeightInG(recipe.Ingredients);
            availablerecipe.Active = recipe.Active;
            availablerecipe.UpdatedBy = recipe.UpdatedBy;
            availablerecipe.UpdatedOn = DateTime.UtcNow;
            _db.Update(availablerecipe);
            await _db.SaveChangesAsync();
            return availablerecipe;
        }

        public async Task<List<Recipe>> GetRecipe()
        {
            var recipe = await _db.Recipes.ToListAsync();
            return recipe;
        }
    }
}
