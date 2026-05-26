using System;
using System.Collections.Generic;

namespace gkb_service.Models;

public partial class Role
{
    public int Roleid { get; set; }

    public string? RoleType { get; set; }

    public DateTime? Createdon { get; set; }

    public DateTime? Updatedon { get; set; }

    public int? Createdby { get; set; }

    public int? Updatedby { get; set; }

    public int? Active { get; set; }

    public virtual ICollection<UserDetail> UserDetails { get; set; } = new List<UserDetail>();
}
