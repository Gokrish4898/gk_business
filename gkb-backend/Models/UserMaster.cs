using System.ComponentModel.DataAnnotations.Schema;

namespace gkb_service.Models
{
    [Table("usermaster")]
    public class UserMaster : BaseAuditableEntity
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? SaltValue { get; set; }
        public string? HashValue { get; set; }
        public string? HouseNo { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? Area { get; set; }
        public string? State { get; set; }
        public string? Mobile { get; set; }
        public int RoleId { get; set; } = 2; // Default is 2 (Customer)
        
        // Profile enhancements
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
