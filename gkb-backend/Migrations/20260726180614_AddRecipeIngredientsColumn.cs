using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipeIngredientsColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "recipe_details",
                table: "recipe");

            migrationBuilder.AlterColumn<float>(
                name: "unit_price",
                table: "stock",
                type: "real",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ingredients",
                table: "recipe",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ingredients",
                table: "recipe");

            migrationBuilder.AlterColumn<int>(
                name: "unit_price",
                table: "stock",
                type: "integer",
                nullable: true,
                oldClrType: typeof(float),
                oldType: "real",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "recipe_details",
                table: "recipe",
                type: "json",
                nullable: true);
        }
    }
}
