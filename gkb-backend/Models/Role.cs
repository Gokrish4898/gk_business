using System.ComponentModel.DataAnnotations;

namespace gkb_service.Models
{
    public class Role : BaseAuditableEntity
    {
        [Key]
        public int RoleId { get; set; }
        public string? RoleName { get; set; }
    }
}
