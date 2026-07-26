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

        // This will hold the raw JSON string from PostgreSQL
        [Column("ingredients")] 
        public string? Ingredients { get; set; }
    }
}
