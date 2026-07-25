using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "deliverycharge",
                columns: table => new
                {
                    deliverycid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    type = table.Column<string>(type: "text", nullable: true),
                    price = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    type = table.Column<string>(type: "text", nullable: true),
                    promocode = table.Column<string>(type: "text", nullable: true),
                    expiredate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    precentage = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    name = table.Column<string>(type: "text", nullable: true),
                    unit = table.Column<string>(type: "text", nullable: true),
                    unitprice = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    type = table.Column<string>(type: "text", nullable: true),
                    availability = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    name = table.Column<string>(type: "text", nullable: true),
                    delivery = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    role_type = table.Column<string>(type: "text", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_role", x => x.roleid);
                });

            migrationBuilder.CreateTable(
                name: "stock",
                columns: table => new
                {
                    stockid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    stock_name = table.Column<string>(type: "text", nullable: true),
                    unit = table.Column<string>(type: "text", nullable: true),
                    unit_price = table.Column<int>(type: "integer", nullable: true),
                    availability = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_stock", x => x.stockid);
                });

            migrationBuilder.CreateTable(
                name: "Tax",
                columns: table => new
                {
                    taxid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    taxname = table.Column<int>(type: "integer", nullable: true),
                    taxpercentage = table.Column<int>(type: "integer", nullable: true),
                    taxinculde = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    unit = table.Column<int>(type: "integer", nullable: true),
                    unit_price = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                name: "recipe",
                columns: table => new
                {
                    recipeid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    recipe_name = table.Column<string>(type: "text", nullable: true),
                    recipe_details = table.Column<string>(type: "json", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recipe", x => x.recipeid);
                    table.ForeignKey(
                        name: "FK_recipe_product_productid",
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
                    username = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    roleid = table.Column<int>(type: "integer", nullable: false),
                    salthash = table.Column<string>(type: "text", nullable: true),
                    passwordhash = table.Column<string>(type: "text", nullable: true),
                    address_one = table.Column<string>(type: "text", nullable: true),
                    address_two = table.Column<string>(type: "text", nullable: true),
                    pincode = table.Column<string>(type: "text", nullable: true),
                    state = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    mobileno = table.Column<long>(type: "bigint", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    userid = table.Column<int>(type: "integer", nullable: false),
                    paymenttypeid = table.Column<int>(type: "integer", nullable: false),
                    orderdetails = table.Column<string>(type: "json", nullable: true),
                    price = table.Column<int>(type: "integer", nullable: true),
                    discountid = table.Column<int>(type: "integer", nullable: true),
                    deliveryid = table.Column<int>(type: "integer", nullable: true),
                    taxid = table.Column<int>(type: "integer", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                    userid = table.Column<int>(type: "integer", nullable: false),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
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
                name: "IX_recipe_productid",
                table: "recipe",
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "extra_topping");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "price");

            migrationBuilder.DropTable(
                name: "recipe");

            migrationBuilder.DropTable(
                name: "stock");

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
        }
    }
}
