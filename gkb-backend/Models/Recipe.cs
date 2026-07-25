using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Recipe : BaseAuditableEntity
    {
        public int RecipeId { get; set; }
        public int ProductId { get; set; }
        public string? RecipeName { get; set; }

        // This will hold the raw JSON string from PostgreSQL
        public string? RecipeDetails { get; set; }

        // Navigation Property back to the parent Product
        public Product? Product { get; set; }
    }
}
