using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddProductHandlingCharges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "handlingcharge",
                table: "product",
                type: "jsonb",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "handlingcharge",
                table: "product");
        }
    }
}
