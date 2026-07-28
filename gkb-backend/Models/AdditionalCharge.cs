using System.ComponentModel.DataAnnotations;

namespace gkb_service.Models
{
    public class AdditionalCharge : BaseAuditableEntity
    {
        [Key]
        public int ChargeId { get; set; }
        public string? ChargeName { get; set; }
        public float? Amount { get; set; }
    }
}
