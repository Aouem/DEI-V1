using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddEvitableToEvenementIndesiralecontroller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEJSbxeBy19Fdo8x6uzW2ugjrhF47iTHMbXnCgoMRXefoy5FKg3TxI19SuqnxTNgwUg==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEF5Zpm5mcx0G06sJtIqa5zUBXRqvsrxkNX6qkBegiCwLbF/t0dx2IRrT1fylvubz4g==");
        }
    }
}
