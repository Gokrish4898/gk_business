using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using gkb_service.Model;

namespace gkb_service.Models
{
    public class DeliveryCharge : BaseAuditableEntity
    {
        [Key]
        public int DeliveryId { get; set; }

        [Column("city", TypeName = "jsonb")]
        public List<CityChargeItem>? City { get; set; }
    }
}
