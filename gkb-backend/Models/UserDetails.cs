using StackExchange.Redis;

namespace gkb_service.Models
{
    public class UserDetails : BaseAuditableEntity
    {
        public int UserId { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public int RoleId { get; set; }
        public string? SaltHash { get; set; }
        public string? PasswordHash { get; set; }
        public string? AddressOne { get; set; }
        public string? AddressTwo { get; set; }
        public string? Pincode { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public long? MobileNo { get; set; }

        // Navigation Properties
        public Role? Role { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    }
}
