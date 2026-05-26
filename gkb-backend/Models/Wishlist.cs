using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Wishlist
{
    public int Wishlistid { get; set; }

    public int? Userid { get; set; }

    public int? Productid { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual Product? Product { get; set; }

    public virtual UserDetail? User { get; set; }
}
