using System;

namespace gkb_service.Model
{
    public class RatingItem
    {
        public int UserId { get; set; }
        public int RatingStar { get; set; } // 1-5
        public string? RatingComment { get; set; }
        public string? Username { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public int Active { get; set; } = 1; // 0 for inactive, 1 for active
    }
}
