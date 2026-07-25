using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Order : BaseAuditableEntity
    {
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public int PaymentTypeId { get; set; }

        // Stored as JSON in PostgreSQL
        public string? OrderDetails { get; set; }
        public int? Price { get; set; }
        public int? DiscountId { get; set; }
        public int? DeliveryId { get; set; }
        public int? TaxId { get; set; }

        // Navigation Properties
        public UserDetails? User { get; set; }
        public PaymentType? PaymentType { get; set; }
        public Discount? Discount { get; set; }
        public DeliveryCharge? DeliveryCharge { get; set; }
        public Tax? Tax { get; set; }
    }
}
