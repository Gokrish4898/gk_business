using StackExchange.Redis;

namespace gkb_service.Models
{
    public class Stock : BaseAuditableEntity
    {
        public int StockId { get; set; }
        public string? StockName { get; set; }
        public string? Unit { get; set; }
        public float? UnitPrice { get; set; }
        public int? Availability { get; set; }
        public string? ImageLink { get; set; }
    }
}
