using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Product
{
    public int Productid { get; set; }

    public string? Name { get; set; }

    public int? Delivery { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual ICollection<Price> Prices { get; set; } = new List<Price>();

    public virtual ICollection<Recipe> Recipes { get; set; } = new List<Recipe>();

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
