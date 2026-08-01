using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalWeightToRecipe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "TotalWeightInG",
                table: "recipe",
                type: "real",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalWeightInG",
                table: "recipe");
        }
    }
}
