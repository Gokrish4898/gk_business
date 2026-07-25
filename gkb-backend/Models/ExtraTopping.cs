using StackExchange.Redis;

namespace gkb_service.Models
{
    public class ExtraTopping : BaseAuditableEntity
    {
        public int ExToppingId { get; set; }
        public string? Name { get; set; }
        public string? Unit { get; set; }
        public int? UnitPrice { get; set; }
    }
}
