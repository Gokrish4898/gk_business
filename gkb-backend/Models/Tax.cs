using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Tax : BaseAuditableEntity
    {
        public int TaxId { get; set; }
        public int? TaxName { get; set; }
        public int? TaxPercentage { get; set; }
        public int? TaxInculde { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
