using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class UserDetail
{
    public int Userid { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public int? Roleid { get; set; }

    public string? Password { get; set; }

    public string? Salthash { get; set; }

    public string? Passwordhash { get; set; }

    public string? AddressOne { get; set; }

    public string? AddressTwo { get; set; }

    public string? Pincode { get; set; }

    public string? State { get; set; }

    public string? Country { get; set; }

    public string? Mobileno { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Active { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Role? Role { get; set; }

    public virtual ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
}
