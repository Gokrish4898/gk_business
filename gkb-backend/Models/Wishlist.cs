using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using gkb_service.Model;

namespace gkb_service.Models
{
    public class Wishlist : BaseAuditableEntity
    {
        public int WishlistId { get; set; }
        public int UserId { get; set; }

        [Column("wishlistdetails", TypeName = "jsonb")]
        public List<WishlistItem>? WishlistDetails { get; set; }
    }
}
