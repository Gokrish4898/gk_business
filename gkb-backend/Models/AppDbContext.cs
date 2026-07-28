using gkb_service.Models;
using gkb_service.Model;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Collections.Generic;

namespace snapdough_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AdditionalCharge> AdditionalCharges { get; set; }
        public DbSet<DeliveryCharge> DeliveryCharges { get; set; }
        public DbSet<UserMaster> UserMasters { get; set; }
        public DbSet<UserAddress> UserAddresses { get; set; }
        public DbSet<PaymentMaster> PaymentMasters { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderStatusMaster> OrderStatusMasters { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

        private static readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = false
        };

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Recipe>(e => {
                e.ToTable("recipe");
                e.HasKey(r => r.RecipeId);
                e.Property(r => r.RecipeId).HasColumnName("recipeid");
                e.Property(r => r.RecipeName).HasColumnName("recipe_name");
                
                e.Property(r => r.Ingredients)
                 .HasColumnName("ingredients")
                 .HasColumnType("jsonb")
                 .HasConversion(
                     v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
                     v => string.IsNullOrEmpty(v) ? new List<RecipeIngredient>() : JsonSerializer.Deserialize<List<RecipeIngredient>>(v, _jsonOptions) ?? new List<RecipeIngredient>()
                 );

                MapAuditColumns(e);
            });

            modelBuilder.Entity<Stock>(e => {
                e.ToTable("stock");
                e.HasKey(s => s.StockId);
                e.Property(s => s.StockId).HasColumnName("stockid");
                e.Property(s => s.StockName).HasColumnName("stock_name");
                e.Property(s => s.Unit).HasColumnName("unit");
                e.Property(s => s.UnitPrice).HasColumnName("unit_price");
                e.Property(s => s.Availability).HasColumnName("availability");
                e.Property(s => s.ImageLink).HasColumnName("imagelink");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Product>(e => {
                e.ToTable("product");
                e.HasKey(p => p.ProductId);
                e.Property(p => p.ProductId).HasColumnName("productid");
                e.Property(p => p.Name).HasColumnName("name");
                e.Property(p => p.Delivery).HasColumnName("delivery");
                e.Property(p => p.Price).HasColumnName("price");
                e.Property(p => p.InStock).HasColumnName("instock");
                e.Property(p => p.ImageLink).HasColumnName("imagelink");
                
                e.Property(p => p.ReceipeId)
                 .HasColumnName("receipeid")
                 .HasColumnType("jsonb")
                 .HasConversion(
                     v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
                     v => string.IsNullOrEmpty(v) ? new List<ProductRecipeMapping>() : JsonSerializer.Deserialize<List<ProductRecipeMapping>>(v, _jsonOptions) ?? new List<ProductRecipeMapping>()
                 );

                e.Property(p => p.HandlingCharge)
                 .HasColumnName("handlingcharge")
                 .HasColumnType("jsonb")
                 .HasConversion(
                     v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
                     v => string.IsNullOrEmpty(v) ? new List<ProductHandlingChargeMapping>() : JsonSerializer.Deserialize<List<ProductHandlingChargeMapping>>(v, _jsonOptions) ?? new List<ProductHandlingChargeMapping>()
                 );

                MapAuditColumns(e);
            });

            modelBuilder.Entity<Wishlist>(e => {
                e.ToTable("wishlist");
                e.HasKey(w => w.WishlistId);
                e.Property(w => w.WishlistId).HasColumnName("wishlistid");
                e.Property(w => w.UserId).HasColumnName("userid");
                
                e.Property(w => w.WishlistDetails)
                 .HasColumnName("wishlistdetails")
                 .HasColumnType("jsonb")
                 .HasConversion(
                     v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
                     v => string.IsNullOrEmpty(v) ? new List<WishlistItem>() : JsonSerializer.Deserialize<List<WishlistItem>>(v, _jsonOptions) ?? new List<WishlistItem>()
                 );

                MapAuditColumns(e);
            });

            modelBuilder.Entity<Rating>(e => {
                e.ToTable("rating");
                e.HasKey(r => r.RatingId);
                e.Property(r => r.RatingId).HasColumnName("ratingid");
                e.Property(r => r.ProductId).HasColumnName("productid");
                
                e.Property(r => r.RatingDetails)
                 .HasColumnName("ratingdetails")
                 .HasColumnType("jsonb")
                 .HasConversion(
                     v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
                     v => string.IsNullOrEmpty(v) ? new List<RatingItem>() : JsonSerializer.Deserialize<List<RatingItem>>(v, _jsonOptions) ?? new List<RatingItem>()
                 );

                MapAuditColumns(e);
            });

            modelBuilder.Entity<Role>(e => {
                e.ToTable("role");
                e.HasKey(r => r.RoleId);
                e.Property(r => r.RoleId).HasColumnName("roleid");
                e.Property(r => r.RoleName).HasColumnName("rolename");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<AdditionalCharge>(e => {
                e.ToTable("additionalcharge");
                e.HasKey(c => c.ChargeId);
                e.Property(c => c.ChargeId).HasColumnName("chargeid");
                e.Property(c => c.ChargeName).HasColumnName("charge_name");
                e.Property(c => c.Amount).HasColumnName("amount");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<DeliveryCharge>(e => {
                e.ToTable("deliverycharge");
                e.HasKey(d => d.DeliveryId);
                e.Property(d => d.DeliveryId).HasColumnName("deliveryid");
                
                e.Property(d => d.City)
                 .HasColumnName("city")
                 .HasColumnType("jsonb")
                 .HasConversion(
                     v => v == null ? null : JsonSerializer.Serialize(v, _jsonOptions),
                     v => string.IsNullOrEmpty(v) ? new List<CityChargeItem>() : JsonSerializer.Deserialize<List<CityChargeItem>>(v, _jsonOptions) ?? new List<CityChargeItem>()
                 );

                MapAuditColumns(e);
            });

            modelBuilder.Entity<UserMaster>(e => {
                e.ToTable("usermaster");
                e.HasKey(u => u.UserId);
                e.Property(u => u.UserId).HasColumnName("userid").ValueGeneratedOnAdd();
                e.Property(u => u.Username).HasColumnName("username");
                e.Property(u => u.Email).HasColumnName("email");
                e.Property(u => u.Password).HasColumnName("password");
                e.Property(u => u.SaltValue).HasColumnName("saltvalue");
                e.Property(u => u.HashValue).HasColumnName("hashvalue");
                e.Property(u => u.HouseNo).HasColumnName("houseno");
                e.Property(u => u.AddressLine1).HasColumnName("addressline1");
                e.Property(u => u.AddressLine2).HasColumnName("addressline2");
                e.Property(u => u.Area).HasColumnName("area");
                e.Property(u => u.State).HasColumnName("state");
                e.Property(u => u.Mobile).HasColumnName("mobile");
                e.Property(u => u.RoleId).HasColumnName("roleid").HasDefaultValue(2);
                e.Property(u => u.FirstName).HasColumnName("firstname");
                e.Property(u => u.LastName).HasColumnName("lastname");
                e.Property(u => u.DisplayName).HasColumnName("displayname");
                e.Property(u => u.Gender).HasColumnName("gender");
                e.Property(u => u.DateOfBirth).HasColumnName("dateofbirth");
                e.Property(u => u.ProfilePicture).HasColumnName("profilepicture");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<UserAddress>(e => {
                e.ToTable("useraddress");
                e.HasKey(a => a.AddressId);
                e.Property(a => a.AddressId).HasColumnName("addressid").ValueGeneratedOnAdd();
                e.Property(a => a.UserId).HasColumnName("userid");
                e.Property(a => a.FullName).HasColumnName("fullname");
                e.Property(a => a.MobileNumber).HasColumnName("mobilenumber");
                e.Property(a => a.AddressLine1).HasColumnName("addressline1");
                e.Property(a => a.AddressLine2).HasColumnName("addressline2");
                e.Property(a => a.Landmark).HasColumnName("landmark");
                e.Property(a => a.City).HasColumnName("city");
                e.Property(a => a.State).HasColumnName("state");
                e.Property(a => a.Country).HasColumnName("country");
                e.Property(a => a.Pincode).HasColumnName("pincode");
                e.Property(a => a.AddressType).HasColumnName("addresstype");
                e.Property(a => a.IsDefault).HasColumnName("isdefault");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<PaymentMaster>(e => {
                e.ToTable("paymentmaster");
                e.HasKey(p => p.PaymentId);
                e.Property(p => p.PaymentId).HasColumnName("paymentid").ValueGeneratedOnAdd();
                e.Property(p => p.PaymentName).HasColumnName("paymentname");
                e.Property(p => p.Description).HasColumnName("description");
                e.Property(p => p.DisplayOrder).HasColumnName("displayorder");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Cart>(e => {
                e.ToTable("cart");
                e.HasKey(c => c.CartId);
                e.Property(c => c.CartId).HasColumnName("cartid").ValueGeneratedOnAdd();
                e.Property(c => c.UserId).HasColumnName("userid");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<CartItem>(e => {
                e.ToTable("cartitem");
                e.HasKey(ci => ci.CartItemId);
                e.Property(ci => ci.CartItemId).HasColumnName("cartitemid").ValueGeneratedOnAdd();
                e.Property(ci => ci.CartId).HasColumnName("cartid");
                e.Property(ci => ci.ProductId).HasColumnName("productid");
                e.Property(ci => ci.Quantity).HasColumnName("quantity");
                e.Property(ci => ci.RecipeDetails).HasColumnName("recipedetails");
                e.Property(ci => ci.CartDetails).HasColumnName("cartdetails");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Order>(e => {
                e.ToTable("orders");
                e.HasKey(o => o.OrderId);
                e.Property(o => o.OrderId).HasColumnName("orderid").ValueGeneratedOnAdd();
                e.Property(o => o.OrderNumber).HasColumnName("ordernumber");
                e.Property(o => o.UserId).HasColumnName("userid");
                e.Property(o => o.AddressId).HasColumnName("addressid");
                e.Property(o => o.PaymentId).HasColumnName("paymentid");
                e.Property(o => o.OrderStatus).HasColumnName("orderstatus");
                e.Property(o => o.StatusMessage).HasColumnName("statusmessage");
                e.Property(o => o.Subtotal).HasColumnName("subtotal");
                e.Property(o => o.DiscountAmount).HasColumnName("discountamount");
                e.Property(o => o.DeliveryCharge).HasColumnName("deliverycharge");
                e.Property(o => o.TaxAmount).HasColumnName("taxamount");
                e.Property(o => o.GrandTotal).HasColumnName("grandtotal");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<OrderItem>(e => {
                e.ToTable("orderitem");
                e.HasKey(oi => oi.OrderItemId);
                e.Property(oi => oi.OrderItemId).HasColumnName("orderitemid").ValueGeneratedOnAdd();
                e.Property(oi => oi.OrderId).HasColumnName("orderid");
                e.Property(oi => oi.ProductId).HasColumnName("productid");
                e.Property(oi => oi.ProductNameSnapshot).HasColumnName("productnamesnapshot");
                e.Property(oi => oi.ProductPriceSnapshot).HasColumnName("productpricesnapshot");
                e.Property(oi => oi.Quantity).HasColumnName("quantity");
                e.Property(oi => oi.RecipeDetails).HasColumnName("recipedetails");
                e.Property(oi => oi.ItemTotal).HasColumnName("itemtotal");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<OrderStatusMaster>(e => {
                e.ToTable("orderstatusmaster");
                e.HasKey(o => o.StatusId);
                e.Property(o => o.StatusId).HasColumnName("statusid").ValueGeneratedOnAdd();
                e.Property(o => o.StatusName).HasColumnName("statusname");
                e.Property(o => o.Description).HasColumnName("description");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<OrderStatusHistory>(e => {
                e.ToTable("orderstatushistory");
                e.HasKey(o => o.StatusHistoryId);
                e.Property(o => o.StatusHistoryId).HasColumnName("statushistoryid").ValueGeneratedOnAdd();
                e.Property(o => o.OrderId).HasColumnName("orderid");
                e.Property(o => o.Status).HasColumnName("status");
                e.Property(o => o.StatusMessage).HasColumnName("statusmessage");
                MapAuditColumns(e);
            });
        }

        // Helper method to keep audit mappings DRY
        private static void MapAuditColumns<T>(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<T> entity) where T : BaseAuditableEntity
        {
            entity.Property(e => e.CreatedOn).HasColumnName("createdon");
            entity.Property(e => e.UpdatedOn).HasColumnName("updatedon");
            entity.Property(e => e.CreatedBy).HasColumnName("createdby");
            entity.Property(e => e.UpdatedBy).HasColumnName("updatedby");
            entity.Property(e => e.Active).HasColumnName("active");
        }
    }
}