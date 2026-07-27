using System;

namespace gkb_service.Model
{
    public class WishlistItem
    {
        public int ProductId { get; set; }
        public int Active { get; set; } = 1; // 0 for inactive, 1 for active
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
