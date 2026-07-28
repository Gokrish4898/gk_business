using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gkb_service.Models
{
    [Table("cartitem")]
    public class CartItem : BaseAuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CartItemId { get; set; }
        public int CartId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string? RecipeDetails { get; set; } // JSONB stored customization mapping
        public string? CartDetails { get; set; } // Stores calculated price details (customCost, handlingCharges, totalPrice)
    }
}
