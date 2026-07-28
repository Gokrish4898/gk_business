using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gkb_service.Models
{
    [Table("orderstatushistory")]
    public class OrderStatusHistory : BaseAuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StatusHistoryId { get; set; }
        public int OrderId { get; set; }
        public string? Status { get; set; }
        public string? StatusMessage { get; set; }
    }
}
