using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Discount
{
    public int Discountid { get; set; }

    public string? Type { get; set; }

    public string? Promocode { get; set; }

    public DateTime? Expiredate { get; set; }

    public decimal? Percentage { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
