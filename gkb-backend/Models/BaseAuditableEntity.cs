namespace gkb_service.Models
{
    public abstract class BaseAuditableEntity
    {
        public DateTime? CreatedOn { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public int? Active { get; set; } = 1;
    }
}
