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