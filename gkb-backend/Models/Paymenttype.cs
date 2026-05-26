using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Paymenttype
{
    public int Paymenttypeid { get; set; }

    public string? Type { get; set; }

    public int? Availability { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
