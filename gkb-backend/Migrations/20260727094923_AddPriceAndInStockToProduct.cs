using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceAndInStockToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "instock",
                table: "product",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "price",
                table: "product",
                type: "real",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "instock",
                table: "product");

            migrationBuilder.DropColumn(
                name: "price",
                table: "product");
        }
    }
}
