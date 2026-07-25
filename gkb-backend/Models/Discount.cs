using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Discount : BaseAuditableEntity
    {
        public int DiscountId { get; set; }
        public string? Type { get; set; }
        public string? PromoCode { get; set; }
        public DateTime? ExpireDate { get; set; }
        public int? Precentage { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
