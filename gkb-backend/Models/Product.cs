using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Product : BaseAuditableEntity
    {
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public int? Delivery { get; set; }

        // Navigation Properties for one-to-many relationships
        public ICollection<Price> Prices { get; set; } = new List<Price>();
        public ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
