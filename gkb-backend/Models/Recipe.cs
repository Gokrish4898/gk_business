using System.ComponentModel.DataAnnotations.Schema;
using gkb_service.Model;
using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Recipe : BaseAuditableEntity
    {
        public int RecipeId { get; set; }
        //public int ProductId { get; set; }
        public string? RecipeName { get; set; }

        // This will hold the JSONB data from PostgreSQL
        [Column("ingredients", TypeName = "jsonb")] 
        public List<RecipeIngredient>? Ingredients { get; set; }
    }
}
