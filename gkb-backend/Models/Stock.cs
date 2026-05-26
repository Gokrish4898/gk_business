using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Stock
{
    public int Stockid { get; set; }

    public string? StockName { get; set; }

    public string? Unit { get; set; }

    public decimal? UnitPrice { get; set; }

    public int? Availability { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }
}
