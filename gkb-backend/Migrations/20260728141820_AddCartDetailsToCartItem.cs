using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddCartDetailsToCartItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "cartdetails",
                table: "cartitem",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "cartdetails",
                table: "cartitem");
        }
    }
}
