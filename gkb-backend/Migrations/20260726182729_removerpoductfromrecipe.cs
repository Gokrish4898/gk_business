using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class removerpoductfromrecipe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_recipe_product_productid",
                table: "recipe");

            migrationBuilder.RenameColumn(
                name: "productid",
                table: "recipe",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_recipe_productid",
                table: "recipe",
                newName: "IX_recipe_ProductId");

            migrationBuilder.AlterColumn<int>(
                name: "ProductId",
                table: "recipe",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_recipe_product_ProductId",
                table: "recipe",
                column: "ProductId",
                principalTable: "product",
                principalColumn: "productid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_recipe_product_ProductId",
                table: "recipe");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "recipe",
                newName: "productid");

            migrationBuilder.RenameIndex(
                name: "IX_recipe_ProductId",
                table: "recipe",
                newName: "IX_recipe_productid");

            migrationBuilder.AlterColumn<int>(
                name: "productid",
                table: "recipe",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_recipe_product_productid",
                table: "recipe",
                column: "productid",
                principalTable: "product",
                principalColumn: "productid",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
