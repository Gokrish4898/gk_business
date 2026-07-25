using StackExchange.Redis;

namespace gkb_service.Models
{
    public class DeliveryCharge : BaseAuditableEntity
    {
        public int DeliveryCId { get; set; }
        public string? Type { get; set; }
        public int? Price { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
