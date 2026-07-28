using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace gkb_service.Migrations
{
    /// <inheritdoc />
    public partial class AddNewMasters : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "additionalcharge",
                columns: table => new
                {
                    chargeid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    charge_name = table.Column<string>(type: "text", nullable: true),
                    amount = table.Column<float>(type: "real", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_additionalcharge", x => x.chargeid);
                });

            migrationBuilder.CreateTable(
                name: "deliverycharge",
                columns: table => new
                {
                    deliveryid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    city = table.Column<string>(type: "jsonb", nullable: true),
                    createdon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updatedon = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    createdby = table.Column<int>(type: "integer", nullable: true),
                    updatedby = table.Column<int>(type: "integer", nullable: true),
                    active = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_deliverycharge", x => x.deliveryid);
                });

            migrationBuilder.CreateTable(
                name: "role",
                columns: table => new
                {
                    roleid = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    rolename = table.Column<string>(type: "text", nullable: true),
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "additionalcharge");

            migrationBuilder.DropTable(
                name: "deliverycharge");

            migrationBuilder.DropTable(
                name: "role");
        }
    }
}
