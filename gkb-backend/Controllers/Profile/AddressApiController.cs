using gkb_service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Profile
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AddressApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AddressApiController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("userId")?.Value;
            return int.TryParse(claim, out int userId) ? userId : 0;
        }

        [HttpGet]
        [Route("List")]
        public async Task<IActionResult> ListAddresses()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var list = await _context.UserAddresses
                .Where(a => a.UserId == userId && a.Active == 1)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.CreatedOn)
                .ToListAsync();

            if (!list.Any())
            {
                var user = await _context.UserMasters.FirstOrDefaultAsync(u => u.UserId == userId);
                if (user != null && (!string.IsNullOrEmpty(user.AddressLine1) || !string.IsNullOrEmpty(user.HouseNo)))
                {
                    var defaultAddress = new UserAddress
                    {
                        UserId = userId,
                        FullName = user.DisplayName ?? user.Username ?? "Default Name",
                        MobileNumber = user.Mobile ?? "",
                        AddressLine1 = string.IsNullOrEmpty(user.HouseNo) ? user.AddressLine1 : $"{user.HouseNo}, {user.AddressLine1}",
                        AddressLine2 = user.AddressLine2 ?? user.Area ?? "",
                        City = user.Area ?? "City",
                        State = user.State ?? "State",
                        Country = "India",
                        Pincode = "605001", // fallback/default pincode
                        AddressType = "Home",
                        IsDefault = 1,
                        CreatedOn = DateTime.UtcNow,
                        CreatedBy = userId,
                        Active = 1
                    };
                    _context.UserAddresses.Add(defaultAddress);
                    await _context.SaveChangesAsync();

                    list.Add(defaultAddress);
                }
            }

            return Ok(new { addresses = list });
        }

        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> AddAddress([FromBody] UserAddress address)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            if (string.IsNullOrEmpty(address.FullName) || string.IsNullOrEmpty(address.AddressLine1) ||
                string.IsNullOrEmpty(address.City) || string.IsNullOrEmpty(address.State) ||
                string.IsNullOrEmpty(address.Pincode))
            {
                return BadRequest(new { error = "Mandatory address fields are missing." });
            }

            // Duplicate validation
            var isDuplicate = await _context.UserAddresses.AnyAsync(a =>
                a.UserId == userId &&
                a.Active == 1 &&
                a.FullName == address.FullName &&
                a.AddressLine1 == address.AddressLine1 &&
                a.City == address.City &&
                a.Pincode == address.Pincode &&
                a.AddressType == address.AddressType);

            if (isDuplicate)
            {
                return BadRequest(new { error = "This address has already been added." });
            }

            address.UserId = userId;
            address.CreatedOn = DateTime.UtcNow;
            address.CreatedBy = userId;
            address.Active = 1;

            // If it is set as default, clear other default addresses for this user
            if (address.IsDefault == 1)
            {
                var defaults = await _context.UserAddresses
                    .Where(a => a.UserId == userId && a.IsDefault == 1)
                    .ToListAsync();
                foreach (var d in defaults) d.IsDefault = 0;
            }
            else
            {
                // If this is the only address, make it the default address
                var hasAny = await _context.UserAddresses.AnyAsync(a => a.UserId == userId && a.Active == 1);
                if (!hasAny)
                {
                    address.IsDefault = 1;
                }
            }

            _context.UserAddresses.Add(address);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Address saved successfully.", address });
        }

        [HttpPost]
        [Route("Update")]
        public async Task<IActionResult> UpdateAddress([FromBody] UserAddress address)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var existing = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == address.AddressId && a.UserId == userId);
            if (existing == null) return NotFound(new { error = "Address not found." });

            // Duplicate validation (excluding self)
            var isDuplicate = await _context.UserAddresses.AnyAsync(a =>
                a.UserId == userId &&
                a.AddressId != address.AddressId &&
                a.Active == 1 &&
                a.FullName == address.FullName &&
                a.AddressLine1 == address.AddressLine1 &&
                a.City == address.City &&
                a.Pincode == address.Pincode &&
                a.AddressType == address.AddressType);

            if (isDuplicate)
            {
                return BadRequest(new { error = "Another address with similar details already exists." });
            }

            existing.FullName = address.FullName;
            existing.MobileNumber = address.MobileNumber;
            existing.AddressLine1 = address.AddressLine1;
            existing.AddressLine2 = address.AddressLine2;
            existing.Landmark = address.Landmark;
            existing.City = address.City;
            existing.State = address.State;
            existing.Country = address.Country;
            existing.Pincode = address.Pincode;
            existing.AddressType = address.AddressType;
            existing.UpdatedOn = DateTime.UtcNow;
            existing.UpdatedBy = userId;

            // Handle default logic
            if (address.IsDefault == 1 && existing.IsDefault == 0)
            {
                var defaults = await _context.UserAddresses
                    .Where(a => a.UserId == userId && a.IsDefault == 1)
                    .ToListAsync();
                foreach (var d in defaults) d.IsDefault = 0;
                existing.IsDefault = 1;
            }

            _context.UserAddresses.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Address updated successfully.", address = existing });
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var existing = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == id && a.UserId == userId);
            if (existing == null) return NotFound(new { error = "Address not found." });

            existing.Active = 0; // Soft delete
            existing.UpdatedOn = DateTime.UtcNow;
            existing.UpdatedBy = userId;

            _context.UserAddresses.Update(existing);
            await _context.SaveChangesAsync();

            // If we deleted the default address, set another active address as default if any exist
            if (existing.IsDefault == 1)
            {
                var nextAddress = await _context.UserAddresses
                    .Where(a => a.UserId == userId && a.Active == 1)
                    .OrderByDescending(a => a.CreatedOn)
                    .FirstOrDefaultAsync();

                if (nextAddress != null)
                {
                    nextAddress.IsDefault = 1;
                    _context.UserAddresses.Update(nextAddress);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { message = "Address deleted successfully." });
        }

        [HttpPost]
        [Route("SetDefault/{id}")]
        public async Task<IActionResult> SetDefaultAddress(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var address = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == id && a.UserId == userId && a.Active == 1);
            if (address == null) return NotFound(new { error = "Address not found." });

            var defaults = await _context.UserAddresses
                .Where(a => a.UserId == userId && a.IsDefault == 1)
                .ToListAsync();
            foreach (var d in defaults) d.IsDefault = 0;

            address.IsDefault = 1;
            _context.UserAddresses.Update(address);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Default address updated.", address });
        }
    }
}
