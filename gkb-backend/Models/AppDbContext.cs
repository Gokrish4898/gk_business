using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace gkb_service.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Deliverycharge> Deliverycharges { get; set; }

    public virtual DbSet<Discount> Discounts { get; set; }

    public virtual DbSet<ExtraTopping> ExtraToppings { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<Paymenttype> Paymenttypes { get; set; }

    public virtual DbSet<Price> Prices { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<Recipe> Recipes { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Stock> Stocks { get; set; }

    public virtual DbSet<Tax> Taxes { get; set; }

    public virtual DbSet<UserDetail> UserDetails { get; set; }

    public virtual DbSet<Wishlist> Wishlists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseNpgsql("Host=dpg-d7no68gg4nts73bar8gg-a.ohio-postgres.render.com;Port=5432;Database=gkb_dev;Username=gkb_dev_user;Password=Rq6sz94W1X3kLM9Q8DhcEJ7SCpEQ3jvf;SslMode=Require;TrustServerCertificate=True;Include Error Detail=true;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Deliverycharge>(entity =>
        {
            entity.HasKey(e => e.Deliverycid).HasName("deliverycharge_pkey");

            entity.ToTable("deliverycharge");

            entity.Property(e => e.Deliverycid).HasColumnName("deliverycid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<Discount>(entity =>
        {
            entity.HasKey(e => e.Discountid).HasName("discount_pkey");

            entity.ToTable("discount");

            entity.Property(e => e.Discountid).HasColumnName("discountid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Expiredate)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("expiredate");
            entity.Property(e => e.Percentage)
                .HasPrecision(5, 2)
                .HasColumnName("percentage");
            entity.Property(e => e.Promocode)
                .HasMaxLength(50)
                .HasColumnName("promocode");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<ExtraTopping>(entity =>
        {
            entity.HasKey(e => e.ExToppingid).HasName("extra_topping_pkey");

            entity.ToTable("extra_topping");

            entity.Property(e => e.ExToppingid).HasColumnName("ex_toppingid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .HasColumnName("unit");
            entity.Property(e => e.Unitprice)
                .HasPrecision(10, 2)
                .HasColumnName("unitprice");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Orderid).HasName("orders_pkey");

            entity.ToTable("orders");

            entity.Property(e => e.Orderid).HasColumnName("orderid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Deliveryid).HasColumnName("deliveryid");
            entity.Property(e => e.Discountid).HasColumnName("discountid");
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(50)
                .HasDefaultValueSql("'Pending'::character varying")
                .HasColumnName("order_status");
            entity.Property(e => e.Orderdetails)
                .HasColumnType("json")
                .HasColumnName("orderdetails");
            entity.Property(e => e.Paymenttypeid).HasColumnName("paymenttypeid");
            entity.Property(e => e.Price)
                .HasPrecision(10, 2)
                .HasColumnName("price");
            entity.Property(e => e.Taxid).HasColumnName("taxid");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.Delivery).WithMany(p => p.Orders)
                .HasForeignKey(d => d.Deliveryid)
                .HasConstraintName("orders_deliveryid_fkey");

            entity.HasOne(d => d.Discount).WithMany(p => p.Orders)
                .HasForeignKey(d => d.Discountid)
                .HasConstraintName("orders_discountid_fkey");

            entity.HasOne(d => d.Paymenttype).WithMany(p => p.Orders)
                .HasForeignKey(d => d.Paymenttypeid)
                .HasConstraintName("orders_paymenttypeid_fkey");

            entity.HasOne(d => d.Tax).WithMany(p => p.Orders)
                .HasForeignKey(d => d.Taxid)
                .HasConstraintName("orders_taxid_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("orders_userid_fkey");
        });

        modelBuilder.Entity<Paymenttype>(entity =>
        {
            entity.HasKey(e => e.Paymenttypeid).HasName("paymenttype_pkey");

            entity.ToTable("paymenttype");

            entity.Property(e => e.Paymenttypeid).HasColumnName("paymenttypeid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Availability).HasColumnName("availability");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .HasColumnName("type");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<Price>(entity =>
        {
            entity.HasKey(e => e.Priceid).HasName("price_pkey");

            entity.ToTable("price");

            entity.Property(e => e.Priceid).HasColumnName("priceid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Productid).HasColumnName("productid");
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .HasColumnName("unit");
            entity.Property(e => e.UnitPrice)
                .HasPrecision(10, 2)
                .HasColumnName("unit_price");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");

            entity.HasOne(d => d.Product).WithMany(p => p.Prices)
                .HasForeignKey(d => d.Productid)
                .HasConstraintName("price_productid_fkey");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Productid).HasName("product_pkey");

            entity.ToTable("product");

            entity.Property(e => e.Productid).HasColumnName("productid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Delivery).HasColumnName("delivery");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .HasColumnName("name");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(e => e.Recipeid).HasName("recipe_pkey");

            entity.ToTable("recipe");

            entity.Property(e => e.Recipeid).HasColumnName("recipeid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Productid).HasColumnName("productid");
            entity.Property(e => e.RecipeDetails)
                .HasColumnType("json")
                .HasColumnName("recipe_details");
            entity.Property(e => e.RecipeName)
                .HasMaxLength(255)
                .HasColumnName("recipe_name");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");

            entity.HasOne(d => d.Product).WithMany(p => p.Recipes)
                .HasForeignKey(d => d.Productid)
                .HasConstraintName("recipe_productid_fkey");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Roleid).HasName("role_pkey");

            entity.ToTable("role");

            entity.Property(e => e.Roleid).HasColumnName("roleid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.RoleType)
                .HasMaxLength(50)
                .HasColumnName("role_type");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<Stock>(entity =>
        {
            entity.HasKey(e => e.Stockid).HasName("stock_pkey");

            entity.ToTable("stock");

            entity.Property(e => e.Stockid).HasColumnName("stockid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Availability).HasColumnName("availability");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.StockName)
                .HasMaxLength(255)
                .HasColumnName("stock_name");
            entity.Property(e => e.Unit)
                .HasMaxLength(50)
                .HasColumnName("unit");
            entity.Property(e => e.UnitPrice)
                .HasPrecision(10, 2)
                .HasColumnName("unit_price");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<Tax>(entity =>
        {
            entity.HasKey(e => e.Taxid).HasName("Tax_pkey");

            entity.ToTable("Tax");

            entity.Property(e => e.Taxid).HasColumnName("taxid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Taxinclude).HasColumnName("taxinclude");
            entity.Property(e => e.Taxname)
                .HasMaxLength(100)
                .HasColumnName("taxname");
            entity.Property(e => e.Taxpercentage)
                .HasPrecision(5, 2)
                .HasColumnName("taxpercentage");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
        });

        modelBuilder.Entity<UserDetail>(entity =>
        {
            entity.HasKey(e => e.Userid).HasName("user_details_pkey");

            entity.ToTable("user_details");

            entity.HasIndex(e => e.Email, "user_details_email_key").IsUnique();

            entity.Property(e => e.Userid).HasColumnName("userid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.AddressOne).HasColumnName("address_one");
            entity.Property(e => e.AddressTwo).HasColumnName("address_two");
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .HasColumnName("country");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Mobileno)
                .HasMaxLength(20)
                .HasColumnName("mobileno");
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .HasColumnName("password");
            entity.Property(e => e.Passwordhash)
                .HasMaxLength(255)
                .HasColumnName("passwordhash");
            entity.Property(e => e.Pincode)
                .HasMaxLength(20)
                .HasColumnName("pincode");
            entity.Property(e => e.Roleid).HasColumnName("roleid");
            entity.Property(e => e.Salthash)
                .HasMaxLength(255)
                .HasColumnName("salthash");
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .HasColumnName("state");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .HasColumnName("username");

            entity.HasOne(d => d.Role).WithMany(p => p.UserDetails)
                .HasForeignKey(d => d.Roleid)
                .HasConstraintName("user_details_roleid_fkey");
        });

        modelBuilder.Entity<Wishlist>(entity =>
        {
            entity.HasKey(e => e.Wishlistid).HasName("wishlist_pkey");

            entity.ToTable("wishlist");

            entity.Property(e => e.Wishlistid).HasColumnName("wishlistid");
            entity.Property(e => e.Active)
                .HasDefaultValue(1)
                .HasColumnName("active");
            entity.Property(e => e.Createdby).HasColumnName("createdby");
            entity.Property(e => e.Createdon)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("createdon");
            entity.Property(e => e.Productid).HasColumnName("productid");
            entity.Property(e => e.Updatedby).HasColumnName("updatedby");
            entity.Property(e => e.Updatedon)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("updatedon");
            entity.Property(e => e.Userid).HasColumnName("userid");

            entity.HasOne(d => d.Product).WithMany(p => p.Wishlists)
                .HasForeignKey(d => d.Productid)
                .HasConstraintName("wishlist_productid_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Wishlists)
                .HasForeignKey(d => d.Userid)
                .HasConstraintName("wishlist_userid_fkey");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
