using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Order
{
    public int Orderid { get; set; }

    public int? Userid { get; set; }

    public int? Paymenttypeid { get; set; }

    public string? Orderdetails { get; set; }

    public decimal? Price { get; set; }

    public string? OrderStatus { get; set; }

    public int? Discountid { get; set; }

    public int? Deliveryid { get; set; }

    public int? Taxid { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual Deliverycharge? Delivery { get; set; }

    public virtual Discount? Discount { get; set; }

    public virtual Paymenttype? Paymenttype { get; set; }

    public virtual Tax? Tax { get; set; }

    public virtual UserDetail? User { get; set; }
}
