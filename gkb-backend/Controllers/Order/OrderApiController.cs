using gkb_service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using snapdough_api.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace gkb_service.Controllers.Order
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderApiController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("userId")?.Value;
            return int.TryParse(claim, out int userId) ? userId : 0;
        }

        [HttpPost]
        [Route("Place")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderModel model)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var address = await _context.UserAddresses.FirstOrDefaultAsync(a => a.AddressId == model.AddressId && a.UserId == userId && a.Active == 1);
            if (address == null) return BadRequest(new { error = "Invalid or inactive shipping address." });

            var payment = await _context.PaymentMasters.FirstOrDefaultAsync(p => p.PaymentId == model.PaymentId && p.Active == 1);
            if (payment == null) return BadRequest(new { error = "Invalid or inactive payment method." });

            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.Active == 1);
            if (cart == null) return BadRequest(new { error = "Cart not found." });

            var cartItems = await _context.CartItems.Where(ci => ci.CartId == cart.CartId && ci.Active == 1).ToListAsync();
            if (!cartItems.Any()) return BadRequest(new { error = "Your cart is empty." });

            var products = await _context.Products.ToDictionaryAsync(p => p.ProductId);
            var stocks = await _context.Stocks.ToDictionaryAsync(s => s.StockId);

            decimal subtotal = 0;
            var orderItems = new List<OrderItem>();

            foreach (var ci in cartItems)
            {
                if (!products.TryGetValue(ci.ProductId, out var product) || product.Active == 0)
                {
                    return BadRequest(new { error = $"Product ID {ci.ProductId} is no longer active." });
                }

                if (product.InStock != true)
                {
                    return BadRequest(new { error = $"Product '{product.Name}' is out of stock." });
                }

                // Try to get price snapshot from CartDetails first
                if (!string.IsNullOrEmpty(ci.CartDetails))
                {
                    try
                    {
                        var priceSnapshot = JsonSerializer.Deserialize<Dictionary<string, decimal>>(ci.CartDetails);
                        if (priceSnapshot != null && priceSnapshot.TryGetValue("totalPrice", out var tp))
                        {
                            decimal detailsUnitPrice = tp;
                            decimal detailsItemTotal = detailsUnitPrice * ci.Quantity;
                            subtotal += detailsItemTotal;

                            orderItems.Add(new OrderItem
                            {
                                ProductId = ci.ProductId,
                                ProductNameSnapshot = product.Name,
                                ProductPriceSnapshot = detailsUnitPrice,
                                Quantity = ci.Quantity,
                                RecipeDetails = ci.RecipeDetails,
                                ItemTotal = detailsItemTotal,
                                CreatedOn = DateTime.UtcNow,
                                Active = 1
                            });

                            // Deduct stocks
                            if (!string.IsNullOrEmpty(ci.RecipeDetails) && ci.RecipeDetails != "[]")
                            {
                                var customizedIngs = JsonSerializer.Deserialize<List<CustomizedIngredientModel>>(ci.RecipeDetails);
                                if (customizedIngs != null)
                                {
                                    foreach (var ing in customizedIngs)
                                    {
                                        if (stocks.TryGetValue(ing.StockId, out var stock))
                                        {
                                            // Validate stock availability
                                            if (stock.Availability < ing.Quantity * ci.Quantity)
                                            {
                                                return BadRequest(new { error = $"Insufficient stock for ingredient '{stock.StockName}'." });
                                            }
                                            stock.Availability -= ing.Quantity * ci.Quantity;
                                            _context.Stocks.Update(stock);
                                        }
                                    }
                                }
                            }

                            continue;
                        }
                    }
                    catch { }
                }

                // Calculate product customized formulation price
                decimal customizedUnitPrice = (decimal)product.Price;

                // If customized ingredients are present, calculate price from ingredient stock costs
                if (!string.IsNullOrEmpty(ci.RecipeDetails) && ci.RecipeDetails != "[]")
                {
                    try
                    {
                        var customizedIngs = JsonSerializer.Deserialize<List<CustomizedIngredientModel>>(ci.RecipeDetails);
                        if (customizedIngs != null && customizedIngs.Any())
                        {
                            decimal ingredientsCost = 0;
                            foreach (var ing in customizedIngs)
                            {
                                if (stocks.TryGetValue(ing.StockId, out var stock))
                                {
                                    ingredientsCost += (decimal)ing.Quantity * (decimal)stock.UnitPrice;
                                    
                                    // Validate stock availability
                                    if (stock.Availability < ing.Quantity * ci.Quantity)
                                    {
                                        return BadRequest(new { error = $"Insufficient stock for ingredient '{stock.StockName}'." });
                                    }
                                }
                            }
                            customizedUnitPrice = ingredientsCost;
                        }
                    }
                    catch (Exception)
                    {
                        // Fallback to base product price if recipe details parsing fails
                        customizedUnitPrice = (decimal)product.Price;
                    }
                }

                // Add mapped handling charges
                decimal handlingTotal = 0;
                if (product.HandlingCharge != null && product.HandlingCharge.Any())
                {
                    var activeCharges = await _context.AdditionalCharges.Where(c => c.Active == 1).ToDictionaryAsync(c => c.ChargeId);
                    foreach (var hc in product.HandlingCharge)
                    {
                        if (activeCharges.TryGetValue(hc.Charged, out var charge))
                        {
                            handlingTotal += (decimal)charge.Amount;
                        }
                    }
                }

                decimal finalItemUnitPrice = customizedUnitPrice + handlingTotal;
                decimal itemTotal = finalItemUnitPrice * ci.Quantity;
                subtotal += itemTotal;

                // Deduct stock availability in DB
                if (!string.IsNullOrEmpty(ci.RecipeDetails) && ci.RecipeDetails != "[]")
                {
                    try
                    {
                        var customizedIngs = JsonSerializer.Deserialize<List<CustomizedIngredientModel>>(ci.RecipeDetails);
                        if (customizedIngs != null)
                        {
                            foreach (var ing in customizedIngs)
                            {
                                if (stocks.TryGetValue(ing.StockId, out var stock))
                                {
                                    stock.Availability -= ing.Quantity * ci.Quantity;
                                    _context.Stocks.Update(stock);
                                }
                            }
                        }
                    }
                    catch { }
                }

                orderItems.Add(new OrderItem
                {
                    ProductId = ci.ProductId,
                    ProductNameSnapshot = product.Name,
                    ProductPriceSnapshot = finalItemUnitPrice,
                    Quantity = ci.Quantity,
                    RecipeDetails = ci.RecipeDetails,
                    ItemTotal = itemTotal,
                    CreatedOn = DateTime.UtcNow,
                    Active = 1
                });
            }

            // Calculate dynamic delivery charge by pincode from deliverycharge master
            decimal deliveryCharge = 50.0m; // Default
            var deliveryConfigs = await _context.DeliveryCharges.Where(d => d.Active == 1).ToListAsync();
            bool pincodeFound = false;

            if (!string.IsNullOrEmpty(address.Pincode))
            {
                foreach (var config in deliveryConfigs)
                {
                    if (config.City != null)
                    {
                        foreach (var cityConfig in config.City)
                        {
                            var matchedPin = cityConfig.Pincodes?.FirstOrDefault(p => p.Pincode == address.Pincode);
                            if (matchedPin != null)
                            {
                                deliveryCharge = (decimal)matchedPin.Charge;
                                pincodeFound = true;
                                break;
                            }
                        }
                    }
                    if (pincodeFound) break;
                }
            }

            decimal taxAmount = Math.Round((subtotal * 0.05m) * 100) / 100; // 5% GST
            decimal grandTotal = subtotal + deliveryCharge + taxAmount;

            string orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}";

            var order = new Models.Order
            {
                OrderNumber = orderNumber,
                UserId = userId,
                AddressId = model.AddressId,
                PaymentId = model.PaymentId,
                OrderStatus = "Pending",
                StatusMessage = "Your order has been placed successfully and is pending confirmation.",
                Subtotal = subtotal,
                DiscountAmount = 0,
                DeliveryCharge = deliveryCharge,
                TaxAmount = taxAmount,
                GrandTotal = grandTotal,
                CreatedOn = DateTime.UtcNow,
                CreatedBy = userId,
                Active = 1
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Generates OrderId

            foreach (var oi in orderItems)
            {
                oi.OrderId = order.OrderId;
                _context.OrderItems.Add(oi);
            }

            // Add to timeline history
            var initialHistory = new OrderStatusHistory
            {
                OrderId = order.OrderId,
                Status = "Pending",
                StatusMessage = "Order placed successfully by user.",
                CreatedOn = DateTime.UtcNow,
                CreatedBy = userId,
                Active = 1
            };
            _context.OrderStatusHistories.Add(initialHistory);

            // Clear Cart items
            foreach (var ci in cartItems)
            {
                ci.Active = 0; // soft delete
                ci.UpdatedOn = DateTime.UtcNow;
                ci.UpdatedBy = userId;
                _context.CartItems.Update(ci);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order placed successfully.", orderId = order.OrderId, orderNumber });
        }

        [HttpGet]
        [Route("MyOrders")]
        public async Task<IActionResult> GetMyOrders()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var orders = await _context.Orders
                .Where(o => o.UserId == userId && o.Active == 1)
                .OrderByDescending(o => o.CreatedOn)
                .ToListAsync();

            return Ok(new { orders });
        }

        [HttpGet]
        [Route("Details/{id}")]
        public async Task<IActionResult> GetOrderDetails(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId && o.Active == 1);
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
        [Route("Cancel/{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId && o.Active == 1);
            if (order == null) return NotFound(new { error = "Order not found." });

            // Order can only be cancelled before "Preparing" (i.e. status must be Pending or Confirmed)
            if (order.OrderStatus != "Pending" && order.OrderStatus != "Confirmed")
            {
                return BadRequest(new { error = "Order cannot be cancelled because preparation has already started." });
            }

            order.OrderStatus = "Cancelled";
            order.StatusMessage = "Cancelled by user.";
            order.UpdatedOn = DateTime.UtcNow;
            order.UpdatedBy = userId;

            _context.Orders.Update(order);

            // Add cancellation timeline entry
            var history = new OrderStatusHistory
            {
                OrderId = order.OrderId,
                Status = "Cancelled",
                StatusMessage = "Cancelled by user.",
                CreatedOn = DateTime.UtcNow,
                CreatedBy = userId,
                Active = 1
            };
            _context.OrderStatusHistories.Add(history);

            // Return ingredients back to inventory
            var items = await _context.OrderItems.Where(oi => oi.OrderId == id && oi.Active == 1).ToListAsync();
            var stocks = await _context.Stocks.ToDictionaryAsync(s => s.StockId);
            foreach (var item in items)
            {
                if (!string.IsNullOrEmpty(item.RecipeDetails) && item.RecipeDetails != "[]")
                {
                    try
                    {
                        var customizedIngs = JsonSerializer.Deserialize<List<CustomizedIngredientModel>>(item.RecipeDetails);
                        if (customizedIngs != null)
                        {
                            foreach (var ing in customizedIngs)
                            {
                                if (stocks.TryGetValue(ing.StockId, out var stock))
                                {
                                    stock.Availability += ing.Quantity * item.Quantity;
                                    _context.Stocks.Update(stock);
                                }
                            }
                        }
                    }
                    catch { }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order cancelled successfully.", order });
        }

        [HttpPost]
        [Route("Reorder/{id}")]
        public async Task<IActionResult> Reorder(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var pastOrder = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == id && o.UserId == userId && o.Active == 1);
            if (pastOrder == null) return NotFound(new { error = "Previous order not found." });

            var items = await _context.OrderItems.Where(oi => oi.OrderId == id && oi.Active == 1).ToListAsync();
            if (!items.Any()) return BadRequest(new { error = "No items in previous order to reorder." });

            // Fetch or create user's cart
            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == userId && c.Active == 1);
            if (cart == null)
            {
                cart = new Models.Cart
                {
                    UserId = userId,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId,
                    Active = 1
                };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            foreach (var item in items)
            {
                // Verify product still active
                var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == item.ProductId && p.Active != 0);
                if (product != null && product.InStock == true)
                {
                    // Add item into cart, check duplicates
                    var existingItem = await _context.CartItems.FirstOrDefaultAsync(ci =>
                        ci.CartId == cart.CartId &&
                        ci.ProductId == item.ProductId &&
                        ci.RecipeDetails == item.RecipeDetails &&
                        ci.Active == 1);

                    if (existingItem != null)
                    {
                        existingItem.Quantity += item.Quantity;
                        existingItem.UpdatedOn = DateTime.UtcNow;
                        existingItem.UpdatedBy = userId;
                        _context.CartItems.Update(existingItem);
                    }
                    else
                    {
                        _context.CartItems.Add(new CartItem
                        {
                            CartId = cart.CartId,
                            ProductId = item.ProductId,
                            Quantity = item.Quantity,
                            RecipeDetails = item.RecipeDetails,
                            CreatedOn = DateTime.UtcNow,
                            CreatedBy = userId,
                            Active = 1
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Items successfully added to your cart." });
        }
    }

    public class PlaceOrderModel
    {
        public int AddressId { get; set; }
        public int PaymentId { get; set; }
        public string? DeliveryNotes { get; set; }
    }

    public class CustomizedIngredientModel
    {
        public int StockId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Unit { get; set; }
    }
}
