using System.ComponentModel.DataAnnotations.Schema;
using gkb_service.Model;

namespace gkb_service.Models
{
    public class Product : BaseAuditableEntity
    {
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public int? Delivery { get; set; }
        public float? Price { get; set; }
        public bool? InStock { get; set; } = true;
        public string? ImageLink { get; set; }

        [Column("receipeid", TypeName = "jsonb")]
        public List<ProductRecipeMapping>? ReceipeId { get; set; }

        [Column("handlingcharge", TypeName = "jsonb")]
        public List<ProductHandlingChargeMapping>? HandlingCharge { get; set; }
    }
}
