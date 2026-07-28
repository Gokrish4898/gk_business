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
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminOrderApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminOrderApiController(AppDbContext context)
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
        public async Task<IActionResult> ListOrders(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? statusFilter = null,
            [FromQuery] string? sortBy = "createdOn",
            [FromQuery] string? sortOrder = "desc",
            [FromQuery] int pageIndex = 0,
            [FromQuery] int pageSize = 5)
        {
            var query = _context.Orders.Where(o => o.Active == 1);

            // Searching
            if (!string.IsNullOrEmpty(searchTerm))
            {
                var searchLower = searchTerm.ToLower();
                
                // Fetch user IDs matching username/email
                var matchedUserIds = await _context.UserMasters
                    .Where(u => u.Username.ToLower().Contains(searchLower) || u.Email.ToLower().Contains(searchLower))
                    .Select(u => u.UserId)
                    .ToListAsync();

                query = query.Where(o => o.OrderNumber.ToLower().Contains(searchLower) || matchedUserIds.Contains(o.UserId));
            }

            // Filtering
            if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "all")
            {
                query = query.Where(o => o.OrderStatus.ToLower() == statusFilter.ToLower());
            }

            // Sorting
            if (sortBy?.ToLower() == "grandtotal")
            {
                query = sortOrder?.ToLower() == "asc" ? query.OrderBy(o => o.GrandTotal) : query.OrderByDescending(o => o.GrandTotal);
            }
            else if (sortBy?.ToLower() == "ordernumber")
            {
                query = sortOrder?.ToLower() == "asc" ? query.OrderBy(o => o.OrderNumber) : query.OrderByDescending(o => o.OrderNumber);
            }
            else
            {
                query = sortOrder?.ToLower() == "asc" ? query.OrderBy(o => o.CreatedOn) : query.OrderByDescending(o => o.CreatedOn);
            }

            int totalCount = await query.CountAsync();
            var list = await query
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // Load related user records
            var userIds = list.Select(o => o.UserId).Distinct().ToList();
            var users = await _context.UserMasters
                .Where(u => userIds.Contains(u.UserId))
                .ToDictionaryAsync(u => u.UserId);

            var ordersResult = list.Select(o =>
            {
                users.TryGetValue(o.UserId, out var user);
                return new
                {
                    orderId = o.OrderId,
                    orderNumber = o.OrderNumber,
                    userId = o.UserId,
                    username = user?.Username ?? "Unknown Customer",
                    email = user?.Email ?? "",
                    orderStatus = o.OrderStatus,
                    statusMessage = o.StatusMessage,
                    grandTotal = o.GrandTotal,
                    createdOn = o.CreatedOn
                };
            }).ToList();

            return Ok(new
            {
                orders = ordersResult,
                totalCount = totalCount
            });
        }

        [HttpPost]
        [Route("UpdateStatus")]
        public async Task<IActionResult> UpdateOrderStatus([FromBody] UpdateOrderStatusModel model)
        {
            int adminId = GetCurrentUserId();

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == model.OrderId && o.Active == 1);
            if (order == null) return NotFound(new { error = "Order not found." });

            if (string.IsNullOrEmpty(model.Status))
            {
                return BadRequest(new { error = "Order status is required." });
            }

            // Validate status name exists in status master
            var statusExists = await _context.OrderStatusMasters.AnyAsync(s => s.StatusName.ToLower() == model.Status.ToLower());
            if (!statusExists)
            {
                return BadRequest(new { error = $"Status '{model.Status}' is invalid." });
            }

            order.OrderStatus = model.Status;
            order.StatusMessage = model.StatusMessage ?? $"Order status has been updated to {model.Status}.";
            order.UpdatedOn = DateTime.UtcNow;
            order.UpdatedBy = adminId;

            _context.Orders.Update(order);

            // Add timeline entry
            var history = new OrderStatusHistory
            {
                OrderId = order.OrderId,
                Status = model.Status,
                StatusMessage = order.StatusMessage,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = adminId,
                Active = 1
            };
            _context.OrderStatusHistories.Add(history);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated successfully.", order });
        }
    }

    public class UpdateOrderStatusModel
    {
        public int OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? StatusMessage { get; set; }
    }
}
