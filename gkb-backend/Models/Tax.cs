using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Tax
{
    public int Taxid { get; set; }

    public string? Taxname { get; set; }

    public decimal? Taxpercentage { get; set; }

    public int? Taxinclude { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
