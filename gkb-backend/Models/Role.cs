namespace gkb_service.Models
{
    public class Role : BaseAuditableEntity
    {
        public int RoleId { get; set; }
        public string? RoleType { get; set; }

        // Navigation Property
        public ICollection<UserDetails> Users { get; set; } = new List<UserDetails>();
    }
}
