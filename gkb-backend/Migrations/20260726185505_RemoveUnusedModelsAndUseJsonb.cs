using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using gkb_service.Model;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnusedModelsAndUseJsonb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE recipe DROP CONSTRAINT IF EXISTS \"FK_recipe_product_ProductId\";");
            migrationBuilder.Sql("ALTER TABLE recipe DROP CONSTRAINT IF EXISTS \"FK_recipe_product_productid\";");
            migrationBuilder.Sql("ALTER TABLE recipe DROP CONSTRAINT IF EXISTS \"recipe_productid_fkey\";");
            migrationBuilder.Sql("ALTER TABLE recipe DROP CONSTRAINT IF EXISTS \"recipe_product_productid_fkey\";");


            migrationBuilder.DropTable(
                name: "extra_topping");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "price");

            migrationBuilder.DropTable(
                name: "wishlist");

            migrationBuilder.DropTable(
                name: "Tax");

            migrationBuilder.DropTable(
                name: "deliverycharge");

            migrationBuilder.DropTable(
                name: "discount");

            migrationBuilder.DropTable(
                name: "paymenttype");

            migrationBuilder.DropTable(
                name: "product");

            migrationBuilder.DropTable(
                name: "user_details");

            migrationBuilder.DropTable(
                name: "role");

            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_recipe_ProductId\";");
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_recipe_productid\";");

            migrationBuilder.Sql("ALTER TABLE recipe DROP COLUMN IF EXISTS \"ProductId\";");
            migrationBuilder.Sql("ALTER TABLE recipe DROP COLUMN IF EXISTS \"productid\";");

            migrationBuilder.Sql("ALTER TABLE recipe ALTER COLUMN ingredients TYPE jsonb USING (CASE WHEN ingredients IS NULL OR ingredients = '' THEN '[]'::jsonb ELSE ingredients::jsonb END);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ingredients",
                table: "recipe",
                type: "text",
                nullable: true,
                oldClrType: typeof(List<RecipeIngredient>),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "recipe",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "deliverycharge",
                columns: table => new
                {
                    deliverycid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    price = table.Column<int>(type: "integer", nullable: true),
                    type = table.Column<string>(type: "text", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deliverycharge", x => x.deliverycid);
                });

            migrationBuilder.CreateTable(
                name: "discount",
                columns: table => new
                {
                    discountid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    expiredate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    precentage = table.Column<int>(type: "integer", nullable: true),
                    promocode = table.Column<string>(type: "text", nullable: true),
                    type = table.Column<string>(type: "text", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_discount", x => x.discountid);
                });

            migrationBuilder.CreateTable(
                name: "extra_topping",
                columns: table => new
                {
                    ex_toppingid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    name = table.Column<string>(type: "text", nullable: true),
                    unit = table.Column<string>(type: "text", nullable: true),
                    unitprice = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_extra_topping", x => x.ex_toppingid);
                });

            migrationBuilder.CreateTable(
                name: "paymenttype",
                columns: table => new
                {
                    paymenttypeid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    availability = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    type = table.Column<string>(type: "text", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_paymenttype", x => x.paymenttypeid);
                });

            migrationBuilder.CreateTable(
                name: "product",
                columns: table => new
                {
                    productid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    delivery = table.Column<int>(type: "integer", nullable: true),
                    name = table.Column<string>(type: "text", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_product", x => x.productid);
                });

            migrationBuilder.CreateTable(
                name: "role",
                columns: table => new
                {
                    roleid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    role_type = table.Column<string>(type: "text", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role", x => x.roleid);
                });

            migrationBuilder.CreateTable(
                name: "Tax",
                columns: table => new
                {
                    taxid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    taxinculde = table.Column<int>(type: "integer", nullable: true),
                    taxname = table.Column<int>(type: "integer", nullable: true),
                    taxpercentage = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tax", x => x.taxid);
                });

            migrationBuilder.CreateTable(
                name: "price",
                columns: table => new
                {
                    priceid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    unit = table.Column<int>(type: "integer", nullable: true),
                    unit_price = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_price", x => x.priceid);
                    table.ForeignKey(
                        name: "FK_price_product_productid",
                        column: x => x.productid,
                        principalTable: "product",
                        principalColumn: "productid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_details",
                columns: table => new
                {
                    userid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    roleid = table.Column<int>(type: "integer", nullable: false),
                    active = table.Column<int>(type: "integer", nullable: true),
                    address_one = table.Column<string>(type: "text", nullable: true),
                    address_two = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    mobileno = table.Column<long>(type: "bigint", nullable: true),
                    passwordhash = table.Column<string>(type: "text", nullable: true),
                    pincode = table.Column<string>(type: "text", nullable: true),
                    salthash = table.Column<string>(type: "text", nullable: true),
                    state = table.Column<string>(type: "text", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    username = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_details", x => x.userid);
                    table.ForeignKey(
                        name: "FK_user_details_role_roleid",
                        column: x => x.roleid,
                        principalTable: "role",
                        principalColumn: "roleid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    orderid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    deliveryid = table.Column<int>(type: "integer", nullable: true),
                    discountid = table.Column<int>(type: "integer", nullable: true),
                    paymenttypeid = table.Column<int>(type: "integer", nullable: false),
                    taxid = table.Column<int>(type: "integer", nullable: true),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    orderdetails = table.Column<string>(type: "json", nullable: true),
                    price = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orders", x => x.orderid);
                    table.ForeignKey(
                        name: "FK_orders_Tax_taxid",
                        column: x => x.taxid,
                        principalTable: "Tax",
                        principalColumn: "taxid");
                    table.ForeignKey(
                        name: "FK_orders_deliverycharge_deliveryid",
                        column: x => x.deliveryid,
                        principalTable: "deliverycharge",
                        principalColumn: "deliverycid");
                    table.ForeignKey(
                        name: "FK_orders_discount_discountid",
                        column: x => x.discountid,
                        principalTable: "discount",
                        principalColumn: "discountid");
                    table.ForeignKey(
                        name: "FK_orders_paymenttype_paymenttypeid",
                        column: x => x.paymenttypeid,
                        principalTable: "paymenttype",
                        principalColumn: "paymenttypeid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_orders_user_details_userid",
                        column: x => x.userid,
                        principalTable: "user_details",
                        principalColumn: "userid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "wishlist",
                columns: table => new
                {
                    wishlist = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    active = table.Column<int>(type: "integer", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_wishlist", x => x.wishlist);
                    table.ForeignKey(
                        name: "FK_wishlist_product_productid",
                        column: x => x.productid,
                        principalTable: "product",
                        principalColumn: "productid",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_wishlist_user_details_userid",
                        column: x => x.userid,
                        principalTable: "user_details",
                        principalColumn: "userid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_recipe_ProductId",
                table: "recipe",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_orders_deliveryid",
                table: "orders",
                column: "deliveryid");

            migrationBuilder.CreateIndex(
                name: "IX_orders_discountid",
                table: "orders",
                column: "discountid");

            migrationBuilder.CreateIndex(
                name: "IX_orders_paymenttypeid",
                table: "orders",
                column: "paymenttypeid");

            migrationBuilder.CreateIndex(
                name: "IX_orders_taxid",
                table: "orders",
                column: "taxid");

            migrationBuilder.CreateIndex(
                name: "IX_orders_userid",
                table: "orders",
                column: "userid");

            migrationBuilder.CreateIndex(
                name: "IX_price_productid",
                table: "price",
                column: "productid");

            migrationBuilder.CreateIndex(
                name: "IX_user_details_roleid",
                table: "user_details",
                column: "roleid");

            migrationBuilder.CreateIndex(
                name: "IX_wishlist_productid",
                table: "wishlist",
                column: "productid");

            migrationBuilder.CreateIndex(
                name: "IX_wishlist_userid",
                table: "wishlist",
                column: "userid");

            migrationBuilder.AddForeignKey(
                name: "FK_recipe_product_ProductId",
                table: "recipe",
                column: "ProductId",
                principalTable: "product",
                principalColumn: "productid");
        }
    }
}
