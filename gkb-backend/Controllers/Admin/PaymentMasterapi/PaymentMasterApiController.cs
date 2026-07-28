using gkb_service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentMasterApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentMasterApiController(AppDbContext context)
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
        public async Task<IActionResult> ListActivePayments()
        {
            var list = await _context.PaymentMasters
                .Where(p => p.Active == 1)
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();

            return Ok(new { payments = list });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("AdminList")]
        public async Task<IActionResult> ListAllPaymentsForAdmin()
        {
            var list = await _context.PaymentMasters
                .OrderBy(p => p.DisplayOrder)
                .ToListAsync();

            return Ok(new { payments = list });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("Add")]
        public async Task<IActionResult> AddPayment([FromBody] PaymentMaster payment)
        {
            int adminId = GetCurrentUserId();

            if (string.IsNullOrEmpty(payment.PaymentName))
            {
                return BadRequest(new { error = "Payment name is required." });
            }

            // Duplicate name check
            var isDuplicate = await _context.PaymentMasters.AnyAsync(p =>
                p.PaymentName.ToLower() == payment.PaymentName.ToLower() && p.Active == 1);

            if (isDuplicate)
            {
                return BadRequest(new { error = "A payment method with this name already exists." });
            }

            payment.CreatedOn = DateTime.UtcNow;
            payment.CreatedBy = adminId;
            payment.Active = 1;

            _context.PaymentMasters.Add(payment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment method added successfully.", payment });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("Update")]
        public async Task<IActionResult> UpdatePayment([FromBody] PaymentMaster payment)
        {
            int adminId = GetCurrentUserId();

            var existing = await _context.PaymentMasters.FirstOrDefaultAsync(p => p.PaymentId == payment.PaymentId);
            if (existing == null) return NotFound(new { error = "Payment method not found." });

            if (string.IsNullOrEmpty(payment.PaymentName))
            {
                return BadRequest(new { error = "Payment name is required." });
            }

            // Duplicate name check (excluding self)
            var isDuplicate = await _context.PaymentMasters.AnyAsync(p =>
                p.PaymentId != payment.PaymentId &&
                p.PaymentName.ToLower() == payment.PaymentName.ToLower() &&
                p.Active == 1);

            if (isDuplicate)
            {
                return BadRequest(new { error = "Another payment method with this name already exists." });
            }

            existing.PaymentName = payment.PaymentName;
            existing.Description = payment.Description;
            existing.DisplayOrder = payment.DisplayOrder;
            existing.Active = payment.Active;
            existing.UpdatedOn = DateTime.UtcNow;
            existing.UpdatedBy = adminId;

            _context.PaymentMasters.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment method updated successfully.", payment = existing });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            int adminId = GetCurrentUserId();

            var existing = await _context.PaymentMasters.FirstOrDefaultAsync(p => p.PaymentId == id);
            if (existing == null) return NotFound(new { error = "Payment method not found." });

            existing.Active = 0; // Soft delete
            existing.UpdatedOn = DateTime.UtcNow;
            existing.UpdatedBy = adminId;

            _context.PaymentMasters.Update(existing);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Payment method deleted successfully." });
        }
    }
}
