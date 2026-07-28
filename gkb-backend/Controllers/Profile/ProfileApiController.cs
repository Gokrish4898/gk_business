using gkb_service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Profile
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProfileApiController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("userId")?.Value;
            return int.TryParse(claim, out int userId) ? userId : 0;
        }

        [HttpGet]
        [Route("Get")]
        public async Task<IActionResult> GetProfile()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var user = await _context.UserMasters.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return NotFound(new { error = "User profile not found." });

            return Ok(new
            {
                userId = user.UserId,
                username = user.Username,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                displayName = user.DisplayName,
                gender = user.Gender,
                dateOfBirth = user.DateOfBirth,
                profilePicture = user.ProfilePicture,
                mobile = user.Mobile,
                createdOn = user.CreatedOn
            });
        }

        [HttpPost]
        [Route("Update")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var user = await _context.UserMasters.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return NotFound(new { error = "User profile not found." });

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.DisplayName = model.DisplayName;
            user.Gender = model.Gender;
            user.DateOfBirth = model.DateOfBirth;
            user.ProfilePicture = model.ProfilePicture;
            user.Mobile = model.Mobile;
            user.Username = model.DisplayName ?? user.Username; // Keep username synced with display name if updated
            user.UpdatedOn = DateTime.UtcNow;
            user.UpdatedBy = userId;

            _context.UserMasters.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully.", user });
        }

        [HttpPost]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            if (string.IsNullOrEmpty(model.CurrentPassword) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest(new { error = "Passwords are required." });
            }

            var user = await _context.UserMasters.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return NotFound(new { error = "User not found." });

            // Verify current password hash
            string computedHash = gkb_service.Helpers.PasswordHasher.HashPassword(model.CurrentPassword, user.SaltValue ?? string.Empty);
            if (computedHash != user.HashValue)
            {
                return BadRequest(new { error = "Invalid current password." });
            }

            // Generate new salt and hash
            string salt = gkb_service.Helpers.PasswordHasher.GenerateSalt();
            string hash = gkb_service.Helpers.PasswordHasher.HashPassword(model.NewPassword, salt);
            string encrypted = gkb_service.Helpers.PasswordHasher.EncryptPasswordByUserId(model.NewPassword, user.UserId);

            user.SaltValue = salt;
            user.HashValue = hash;
            user.Password = encrypted;
            user.UpdatedOn = DateTime.UtcNow;
            user.UpdatedBy = userId;

            _context.UserMasters.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully." });
        }
    }

    public class UpdateProfileModel
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DisplayName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Mobile { get; set; }
    }

    public class ChangePasswordModel
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
