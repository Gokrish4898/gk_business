using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace gkb_service.Models
{
    [Table("orders")]
    public class Order : BaseAuditableEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }
        public string? OrderNumber { get; set; }
        public int UserId { get; set; }
        public int AddressId { get; set; }
        public int? PaymentId { get; set; }
        public string? OrderStatus { get; set; }
        public string? StatusMessage { get; set; }
        public decimal Subtotal { get; set; }
        public decimal DiscountAmount { get; set; }
        public decimal DeliveryCharge { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal GrandTotal { get; set; }
    }
}
