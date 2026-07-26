using gkb_service.Models;
using Microsoft.EntityFrameworkCore;

namespace snapdough_api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Role> Roles { get; set; }
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<Price> Prices { get; set; }
        public DbSet<PaymentType> PaymentTypes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<DeliveryCharge> DeliveryCharges { get; set; }
        public DbSet<Tax> Taxes { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<ExtraTopping> ExtraToppings { get; set; }
        //public DbSet<RecipeIngredient> RecipeIngredients { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Role & User Details
            modelBuilder.Entity<Role>(e => {
                e.ToTable("role");
                e.HasKey(r => r.RoleId);
                e.Property(r => r.RoleId).HasColumnName("roleid");
                e.Property(r => r.RoleType).HasColumnName("role_type");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<UserDetails>(e => {
                e.ToTable("user_details");
                e.HasKey(u => u.UserId);
                e.Property(u => u.UserId).HasColumnName("userid");
                e.Property(u => u.Username).HasColumnName("username");
                e.Property(u => u.Email).HasColumnName("email");
                e.Property(u => u.RoleId).HasColumnName("roleid");
                e.Property(u => u.SaltHash).HasColumnName("salthash");
                e.Property(u => u.PasswordHash).HasColumnName("passwordhash");
                e.Property(u => u.AddressOne).HasColumnName("address_one");
                e.Property(u => u.AddressTwo).HasColumnName("address_two");
                e.Property(u => u.Pincode).HasColumnName("pincode");
                e.Property(u => u.State).HasColumnName("state");
                e.Property(u => u.Country).HasColumnName("country");
                e.Property(u => u.MobileNo).HasColumnName("mobileno");
                MapAuditColumns(e);

                e.HasOne(u => u.Role)
                 .WithMany(r => r.Users)
                 .HasForeignKey(u => u.RoleId);
            });

            // 2. Product, Recipe, Price
            modelBuilder.Entity<Product>(e => {
                e.ToTable("product");
                e.HasKey(p => p.ProductId);
                e.Property(p => p.ProductId).HasColumnName("productid");
                e.Property(p => p.Name).HasColumnName("name");
                e.Property(p => p.Delivery).HasColumnName("delivery");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Recipe>(e => {
                e.ToTable("recipe");
                e.HasKey(r => r.RecipeId);
                e.Property(r => r.RecipeId).HasColumnName("recipeid");
                e.Property(r => r.RecipeName).HasColumnName("recipe_name");
                e.Property(r => r.Ingredients).HasColumnName("ingredients");

                // Ensure MapAuditColumns(e) is still here if you use it
                MapAuditColumns(e);

                // Make sure all .HasOne() and .ProductId mappings are completely gone
            });

            modelBuilder.Entity<Price>(e => {
                e.ToTable("price");
                e.HasKey(p => p.PriceId);
                e.Property(p => p.PriceId).HasColumnName("priceid");
                e.Property(p => p.ProductId).HasColumnName("productid");
                e.Property(p => p.Unit).HasColumnName("unit");
                e.Property(p => p.UnitPrice).HasColumnName("unit_price");
                MapAuditColumns(e);

                e.HasOne(p => p.Product)
                 .WithMany(pr => pr.Prices)
                 .HasForeignKey(p => p.ProductId);
            });

            // 3. Wishlist
            modelBuilder.Entity<Wishlist>(e => {
                e.ToTable("wishlist");
                e.HasKey(w => w.WishlistId);
                e.Property(w => w.WishlistId).HasColumnName("wishlist");
                e.Property(w => w.UserId).HasColumnName("userid");
                e.Property(w => w.ProductId).HasColumnName("productid");
                MapAuditColumns(e);

                e.HasOne(w => w.User)
                 .WithMany(u => u.Wishlists)
                 .HasForeignKey(w => w.UserId);

                e.HasOne(w => w.Product)
                 .WithMany(p => p.Wishlists)
                 .HasForeignKey(w => w.ProductId);
            });

            // 4. Orders & Checkout Metadata
            modelBuilder.Entity<PaymentType>(e => {
                e.ToTable("paymenttype");
                e.HasKey(p => p.PaymentTypeId);
                e.Property(p => p.PaymentTypeId).HasColumnName("paymenttypeid");
                e.Property(p => p.Type).HasColumnName("type");
                e.Property(p => p.Availability).HasColumnName("availability");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Discount>(e => {
                e.ToTable("discount");
                e.HasKey(d => d.DiscountId);
                e.Property(d => d.DiscountId).HasColumnName("discountid");
                e.Property(d => d.Type).HasColumnName("type");
                e.Property(d => d.PromoCode).HasColumnName("promocode");
                e.Property(d => d.ExpireDate).HasColumnName("expiredate");
                e.Property(d => d.Precentage).HasColumnName("precentage");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<DeliveryCharge>(e => {
                e.ToTable("deliverycharge");
                e.HasKey(d => d.DeliveryCId);
                e.Property(d => d.DeliveryCId).HasColumnName("deliverycid");
                e.Property(d => d.Type).HasColumnName("type");
                e.Property(d => d.Price).HasColumnName("price");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Tax>(e => {
                e.ToTable("Tax");
                e.HasKey(t => t.TaxId);
                e.Property(t => t.TaxId).HasColumnName("taxid");
                e.Property(t => t.TaxName).HasColumnName("taxname");
                e.Property(t => t.TaxPercentage).HasColumnName("taxpercentage");
                e.Property(t => t.TaxInculde).HasColumnName("taxinculde");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<Order>(e => {
                e.ToTable("orders");
                e.HasKey(o => o.OrderId);
                e.Property(o => o.OrderId).HasColumnName("orderid");
                e.Property(o => o.UserId).HasColumnName("userid");
                e.Property(o => o.PaymentTypeId).HasColumnName("paymenttypeid");
                e.Property(o => o.OrderDetails).HasColumnName("orderdetails").HasColumnType("json");
                e.Property(o => o.Price).HasColumnName("price");
                e.Property(o => o.DiscountId).HasColumnName("discountid");
                e.Property(o => o.DeliveryId).HasColumnName("deliveryid");
                e.Property(o => o.TaxId).HasColumnName("taxid");
                MapAuditColumns(e);

                e.HasOne(o => o.User).WithMany(u => u.Orders).HasForeignKey(o => o.UserId);
                e.HasOne(o => o.PaymentType).WithMany(p => p.Orders).HasForeignKey(o => o.PaymentTypeId);
                e.HasOne(o => o.Discount).WithMany(d => d.Orders).HasForeignKey(o => o.DiscountId);
                e.HasOne(o => o.DeliveryCharge).WithMany(dc => dc.Orders).HasForeignKey(o => o.DeliveryId);
                e.HasOne(o => o.Tax).WithMany(t => t.Orders).HasForeignKey(o => o.TaxId);
            });

            // 5. Standalone Tables
            modelBuilder.Entity<Stock>(e => {
                e.ToTable("stock");
                e.HasKey(s => s.StockId);
                e.Property(s => s.StockId).HasColumnName("stockid");
                e.Property(s => s.StockName).HasColumnName("stock_name");
                e.Property(s => s.Unit).HasColumnName("unit");
                e.Property(s => s.UnitPrice).HasColumnName("unit_price");
                e.Property(s => s.Availability).HasColumnName("availability");
                MapAuditColumns(e);
            });

            modelBuilder.Entity<ExtraTopping>(e => {
                e.ToTable("extra_topping");
                e.HasKey(et => et.ExToppingId);
                e.Property(et => et.ExToppingId).HasColumnName("ex_toppingid");
                e.Property(et => et.Name).HasColumnName("name");
                e.Property(et => et.Unit).HasColumnName("unit");
                e.Property(et => et.UnitPrice).HasColumnName("unitprice");
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