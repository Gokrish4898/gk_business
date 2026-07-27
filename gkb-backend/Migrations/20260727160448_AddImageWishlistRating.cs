using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddImageWishlistRating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "imagelink",
                table: "stock",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "imagelink",
                table: "product",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "rating",
                columns: table => new
                {
                    ratingid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    ratingdetails = table.Column<string>(type: "jsonb", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rating", x => x.ratingid);
                });

            migrationBuilder.CreateTable(
                name: "wishlist",
                columns: table => new
                {
                    wishlistid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    wishlistdetails = table.Column<string>(type: "jsonb", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wishlist", x => x.wishlistid);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "rating");

            migrationBuilder.DropTable(
                name: "wishlist");

            migrationBuilder.DropColumn(
                name: "imagelink",
                table: "stock");

            migrationBuilder.DropColumn(
                name: "imagelink",
                table: "product");
        }
    }
}
