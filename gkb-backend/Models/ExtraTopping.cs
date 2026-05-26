using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class ExtraTopping
{
    public int ExToppingid { get; set; }

    public string? Name { get; set; }

    public string? Unit { get; set; }

    public decimal? Unitprice { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }
}
