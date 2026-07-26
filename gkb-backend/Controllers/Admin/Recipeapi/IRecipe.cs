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
        public async Task<Models.Recipe> AddRecipe(Models.Recipe recipe)
        {
            try
            {
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
