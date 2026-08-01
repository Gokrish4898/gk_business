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

namespace gkb_service.Controllers.Cart
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CartApiController(AppDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst("userId")?.Value;
            return int.TryParse(claim, out int userId) ? userId : 0;
        }

        private async Task<Models.Cart> GetOrCreateActiveCart(int userId)
        {
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
            return cart;
        }

        [HttpGet]
        [Route("Get")]
        public async Task<IActionResult> GetCart()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var cart = await GetOrCreateActiveCart(userId);
            var items = await _context.CartItems
                .Where(ci => ci.CartId == cart.CartId && ci.Active == 1)
                .ToListAsync();

            var products = await _context.Products.ToDictionaryAsync(p => p.ProductId);
            var stocks = await _context.Stocks.ToDictionaryAsync(s => s.StockId);

            var cartDetails = items.Select(item =>
            {
                products.TryGetValue(item.ProductId, out var product);

                var recipeList = new List<object>();
                if (!string.IsNullOrEmpty(item.RecipeDetails))
                {
                    try
                    {
                        var parsed = JsonSerializer.Deserialize<List<Dictionary<string, JsonElement>>>(item.RecipeDetails);
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
                    catch
                    {
                        // Fallback if parsing fails
                    }
                }

                return new
                {
                    cartItemId = item.CartItemId,
                    productId = item.ProductId,
                    productName = product?.Name ?? "Unknown Product",
                    productPrice = product?.Price ?? 0,
                    productImage = product?.ImageLink ?? "",
                    inStock = (product?.InStock == true) ? 1 : 0,
                    quantity = item.Quantity,
                    recipeDetails = recipeList,
                    cartDetails = string.IsNullOrEmpty(item.CartDetails) ? null : JsonSerializer.Deserialize<object>(item.CartDetails)
                };
            }).ToList();

            return Ok(new
            {
                cartId = cart.CartId,
                userId = cart.UserId,
                items = cartDetails
            });
        }

        [HttpPost]
        [Route("AddItem")]
        public async Task<IActionResult> AddItem([FromBody] AddCartItemModel model)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            if (model.ProductId <= 0 || model.Quantity <= 0)
            {
                return BadRequest(new { error = "Invalid product ID or quantity." });
            }

            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == model.ProductId && p.Active != 0);
            if (product == null) return NotFound(new { error = "Product not found." });

            // Stock & Product Availability Validation
            if (product.InStock != true)
            {
                return BadRequest(new { error = $"Product '{product.Name}' is currently out of stock." });
            }

            var cart = await GetOrCreateActiveCart(userId);

            // Serialize customizations to normalize matching
            string serializedRecipe = model.RecipeDetails != null 
                ? JsonSerializer.Serialize(model.RecipeDetails) 
                : "[]";

            // Check if exact customized item already exists in the user's cart
            var existingItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cart.CartId && 
                                           ci.ProductId == model.ProductId && 
                                           ci.RecipeDetails == serializedRecipe && 
                                           ci.Active == 1);

            if (existingItem != null)
            {
                existingItem.Quantity += model.Quantity;
                existingItem.CartDetails = model.CartDetails;
                existingItem.UpdatedOn = DateTime.UtcNow;
                existingItem.UpdatedBy = userId;
                _context.CartItems.Update(existingItem);
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = model.ProductId,
                    Quantity = model.Quantity,
                    RecipeDetails = serializedRecipe,
                    CartDetails = model.CartDetails,
                    CreatedOn = DateTime.UtcNow,
                    CreatedBy = userId,
                    Active = 1
                };
                _context.CartItems.Add(newItem);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Item added to cart successfully." });
        }

        [HttpPost]
        [Route("UpdateQuantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] UpdateCartQuantityModel model)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            if (model.Quantity <= 0)
            {
                return BadRequest(new { error = "Quantity must be greater than zero." });
            }

            var cart = await GetOrCreateActiveCart(userId);
            var item = await _context.CartItems.FirstOrDefaultAsync(ci => ci.CartItemId == model.CartItemId && ci.CartId == cart.CartId && ci.Active == 1);
            
            if (item == null) return NotFound(new { error = "Cart item not found." });

            item.Quantity = model.Quantity;
            item.UpdatedOn = DateTime.UtcNow;
            item.UpdatedBy = userId;

            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item quantity updated." });
        }

        [HttpDelete]
        [Route("RemoveItem/{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var cart = await GetOrCreateActiveCart(userId);
            var item = await _context.CartItems.FirstOrDefaultAsync(ci => ci.CartItemId == id && ci.CartId == cart.CartId && ci.Active == 1);

            if (item == null) return NotFound(new { error = "Cart item not found." });

            item.Active = 0; // Soft delete
            item.UpdatedOn = DateTime.UtcNow;
            item.UpdatedBy = userId;

            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Item removed from cart." });
        }

        [HttpPost]
        [Route("Clear")]
        public async Task<IActionResult> ClearCart()
        {
            int userId = GetCurrentUserId();
            if (userId == 0) return Unauthorized(new { error = "User not logged in." });

            var cart = await GetOrCreateActiveCart(userId);
            var items = await _context.CartItems.Where(ci => ci.CartId == cart.CartId && ci.Active == 1).ToListAsync();

            foreach (var item in items)
            {
                item.Active = 0;
                item.UpdatedOn = DateTime.UtcNow;
                item.UpdatedBy = userId;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cart cleared." });
        }
    }

    public class AddCartItemModel
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public List<object>? RecipeDetails { get; set; }
        public string? CartDetails { get; set; }
    }

    public class UpdateCartQuantityModel
    {
        public int CartItemId { get; set; }
        public int Quantity { get; set; }
    }
}
