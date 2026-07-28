using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddECommerceTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "dateofbirth",
                table: "usermaster",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "displayname",
                table: "usermaster",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "firstname",
                table: "usermaster",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "gender",
                table: "usermaster",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lastname",
                table: "usermaster",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "profilepicture",
                table: "usermaster",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "cart",
                columns: table => new
                {
                    cartid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cart", x => x.cartid);
                });

            migrationBuilder.CreateTable(
                name: "cartitem",
                columns: table => new
                {
                    cartitemid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    cartid = table.Column<int>(type: "integer", nullable: false),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    recipedetails = table.Column<string>(type: "text", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cartitem", x => x.cartitemid);
                });

            migrationBuilder.CreateTable(
                name: "orderitem",
                columns: table => new
                {
                    orderitemid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    orderid = table.Column<int>(type: "integer", nullable: false),
                    productid = table.Column<int>(type: "integer", nullable: false),
                    productnamesnapshot = table.Column<string>(type: "text", nullable: true),
                    productpricesnapshot = table.Column<decimal>(type: "numeric", nullable: false),
                    quantity = table.Column<int>(type: "integer", nullable: false),
                    recipedetails = table.Column<string>(type: "text", nullable: true),
                    itemtotal = table.Column<decimal>(type: "numeric", nullable: false),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orderitem", x => x.orderitemid);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    orderid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ordernumber = table.Column<string>(type: "text", nullable: true),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    addressid = table.Column<int>(type: "integer", nullable: false),
                    paymentid = table.Column<int>(type: "integer", nullable: true),
                    orderstatus = table.Column<string>(type: "text", nullable: true),
                    statusmessage = table.Column<string>(type: "text", nullable: true),
                    subtotal = table.Column<decimal>(type: "numeric", nullable: false),
                    discountamount = table.Column<decimal>(type: "numeric", nullable: false),
                    deliverycharge = table.Column<decimal>(type: "numeric", nullable: false),
                    taxamount = table.Column<decimal>(type: "numeric", nullable: false),
                    grandtotal = table.Column<decimal>(type: "numeric", nullable: false),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orders", x => x.orderid);
                });

            migrationBuilder.CreateTable(
                name: "orderstatushistory",
                columns: table => new
                {
                    statushistoryid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    orderid = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "text", nullable: true),
                    statusmessage = table.Column<string>(type: "text", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orderstatushistory", x => x.statushistoryid);
                });

            migrationBuilder.CreateTable(
                name: "orderstatusmaster",
                columns: table => new
                {
                    statusid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    statusname = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_orderstatusmaster", x => x.statusid);
                });

            migrationBuilder.CreateTable(
                name: "paymentmaster",
                columns: table => new
                {
                    paymentid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    paymentname = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    displayorder = table.Column<int>(type: "integer", nullable: false),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_paymentmaster", x => x.paymentid);
                });

            migrationBuilder.CreateTable(
                name: "useraddress",
                columns: table => new
                {
                    addressid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userid = table.Column<int>(type: "integer", nullable: false),
                    fullname = table.Column<string>(type: "text", nullable: true),
                    mobilenumber = table.Column<string>(type: "text", nullable: true),
                    addressline1 = table.Column<string>(type: "text", nullable: true),
                    addressline2 = table.Column<string>(type: "text", nullable: true),
                    landmark = table.Column<string>(type: "text", nullable: true),
                    city = table.Column<string>(type: "text", nullable: true),
                    state = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    pincode = table.Column<string>(type: "text", nullable: true),
                    addresstype = table.Column<string>(type: "text", nullable: true),
                    isdefault = table.Column<int>(type: "integer", nullable: false),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_useraddress", x => x.addressid);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cart");

            migrationBuilder.DropTable(
                name: "cartitem");

            migrationBuilder.DropTable(
                name: "orderitem");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "orderstatushistory");

            migrationBuilder.DropTable(
                name: "orderstatusmaster");

            migrationBuilder.DropTable(
                name: "paymentmaster");

            migrationBuilder.DropTable(
                name: "useraddress");

            migrationBuilder.DropColumn(
                name: "dateofbirth",
                table: "usermaster");

            migrationBuilder.DropColumn(
                name: "displayname",
                table: "usermaster");

            migrationBuilder.DropColumn(
                name: "firstname",
                table: "usermaster");

            migrationBuilder.DropColumn(
                name: "gender",
                table: "usermaster");

            migrationBuilder.DropColumn(
                name: "lastname",
                table: "usermaster");

            migrationBuilder.DropColumn(
                name: "profilepicture",
                table: "usermaster");
        }
    }
}
