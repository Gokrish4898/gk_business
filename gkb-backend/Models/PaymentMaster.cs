using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gkb_service.Models
{
    [Table("paymentmaster")]
    public class PaymentMaster : BaseAuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentId { get; set; }
        public string? PaymentName { get; set; }
        public string? Description { get; set; }
        public int DisplayOrder { get; set; } = 0;
    }
}
