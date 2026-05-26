using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Price
{
    public int Priceid { get; set; }

    public int? Productid { get; set; }

    public string? Unit { get; set; }

    public decimal? UnitPrice { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual Product? Product { get; set; }
}
