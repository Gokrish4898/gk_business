using StackExchange.Redis;

namespace gkb_service.Models
{
    public class PaymentType : BaseAuditableEntity
    {
        public int PaymentTypeId { get; set; }
        public string? Type { get; set; }
        public int? Availability { get; set; }

        // Navigation Property
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
