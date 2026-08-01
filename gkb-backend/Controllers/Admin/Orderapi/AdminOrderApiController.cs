using gkb_service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System;
using System.Linq;
using System.Text.Json;
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

            // Load related addresses
            var addressIds = list.Select(o => o.AddressId).Distinct().ToList();
            var addresses = await _context.UserAddresses
                .Where(a => addressIds.Contains(a.AddressId))
                .ToDictionaryAsync(a => a.AddressId);

            // Check which orders have customized recipes
            var orderIds = list.Select(o => o.OrderId).ToList();
            var orderItemHasRecipe = await _context.OrderItems
                .Where(oi => orderIds.Contains(oi.OrderId) && oi.Active == 1 && !string.IsNullOrEmpty(oi.RecipeDetails) && oi.RecipeDetails != "[]")
                .Select(oi => oi.OrderId)
                .Distinct()
                .ToListAsync();

            var ordersResult = list.Select(o =>
            {
                users.TryGetValue(o.UserId, out var user);
                addresses.TryGetValue(o.AddressId, out var addr);

                string addressText = "";
                if (addr != null)
                {
                    addressText = $"{addr.AddressLine1}, {(string.IsNullOrEmpty(addr.AddressLine2) ? "" : addr.AddressLine2 + ", ")}{addr.City}, {addr.State} - {addr.Pincode}";
                }

                bool hasRecipe = orderItemHasRecipe.Contains(o.OrderId);

                return new
                {
                    orderId = o.OrderId,
                    orderNumber = o.OrderNumber,
                    userId = o.UserId,
                    username = user?.Username ?? "Unknown Customer",
                    email = user?.Email ?? "",
                    addressText = addressText,
                    hasRecipe = hasRecipe,
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

        [HttpGet]
        [Route("Details/{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == id && o.Active == 1);
            if (order == null) return NotFound(new { error = "Order not found." });

            var items = await _context.OrderItems
                .Where(oi => oi.OrderId == id && oi.Active == 1)
                .ToListAsync();

            var address = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == order.AddressId);
            var payment = await _context.PaymentMasters.FirstOrDefaultAsync(p => p.PaymentId == order.PaymentId);
            var timeline = await _context.OrderStatusHistories
                .Where(h => h.OrderId == id && h.Active == 1)
                .OrderBy(h => h.CreatedOn)
                .ToListAsync();

            var products = await _context.Products.ToDictionaryAsync(p => p.ProductId);
            var stocks = await _context.Stocks.ToDictionaryAsync(s => s.StockId);

            var itemsDetail = items.Select(oi =>
            {
                products.TryGetValue(oi.ProductId, out var product);

                var recipeList = new List<object>();
                if (!string.IsNullOrEmpty(oi.RecipeDetails))
                {
                    try
                    {
                        var parsed = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(oi.RecipeDetails);
                        if (parsed != null)
                        {
                            foreach (var ing in parsed)
                            {
                                string name = ing.TryGetValue("name", out var nEl) ? nEl.GetString() ?? "" : "";
                                int qty = ing.TryGetValue("quantity", out var qEl) ? qEl.GetInt32() : 0;
                                int stockId = ing.TryGetValue("stockId", out var sEl) ? sEl.GetInt32() : 0;
                                string? unit = ing.TryGetValue("unit", out var uEl) ? uEl.GetString() : null;

                                if (string.IsNullOrEmpty(unit) && stockId > 0 && stocks.TryGetValue(stockId, out var stock))
                                {
                                    unit = stock.Unit;
                                }

                                recipeList.Add(new
                                {
                                    stockId,
                                    name,
                                    quantity = qty,
                                    unit = unit ?? "units"
                                });
                            }
                        }
                    }
                    catch { }
                }

                return new
                {
                    orderItemId = oi.OrderItemId,
                    productId = oi.ProductId,
                    productName = oi.ProductNameSnapshot ?? product?.Name ?? "Unknown Product",
                    productPrice = oi.ProductPriceSnapshot,
                    productImage = product?.ImageLink ?? "",
                    quantity = oi.Quantity,
                    recipeDetails = recipeList,
                    itemTotal = oi.ItemTotal
                };
            }).ToList();

            return Ok(new
            {
                orderId = order.OrderId,
                orderNumber = order.OrderNumber,
                orderStatus = order.OrderStatus,
                statusMessage = order.StatusMessage,
                subtotal = order.Subtotal,
                discountAmount = order.DiscountAmount,
                deliveryCharge = order.DeliveryCharge,
                taxAmount = order.TaxAmount,
                grandTotal = order.GrandTotal,
                createdOn = order.CreatedOn,
                address = address,
                payment = payment,
                items = itemsDetail,
                timeline = timeline
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
