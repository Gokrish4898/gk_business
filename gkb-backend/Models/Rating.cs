using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using gkb_service.Model;

namespace gkb_service.Models
{
    public class Rating : BaseAuditableEntity
    {
        public int RatingId { get; set; }
        public int ProductId { get; set; }

        [Column("ratingdetails", TypeName = "jsonb")]
        public List<RatingItem>? RatingDetails { get; set; }
    }
}
