using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gkb_service.Models
{
    [Table("orderitem")]
    public class OrderItem : BaseAuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderItemId { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string? ProductNameSnapshot { get; set; }
        public decimal ProductPriceSnapshot { get; set; }
        public int Quantity { get; set; }
        public string? RecipeDetails { get; set; } // JSONB stored customization mapping
        public decimal ItemTotal { get; set; }
    }
}
