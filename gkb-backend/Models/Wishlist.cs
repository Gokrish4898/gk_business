using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Wishlist : BaseAuditableEntity
    {
        public int WishlistId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }

        // Navigation Properties bridging User and Product
        public UserDetails? User { get; set; }
        public Product? Product { get; set; }
    }
}
