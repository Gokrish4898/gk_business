using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Price : BaseAuditableEntity
    {
        public int PriceId { get; set; }
        public int ProductId { get; set; }
        public int? Unit { get; set; }
        public int? UnitPrice { get; set; }

        // Navigation Property back to the parent Product
        public Product? Product { get; set; }
    }
}
