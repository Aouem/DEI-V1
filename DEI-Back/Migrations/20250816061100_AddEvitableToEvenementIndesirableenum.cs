using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddEvitableToEvenementIndesirableenum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEF5Zpm5mcx0G06sJtIqa5zUBXRqvsrxkNX6qkBegiCwLbF/t0dx2IRrT1fylvubz4g==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEIPK2qX0trC29JQp0tPn1XU8QmIj4Lgel85Yk2nmU0vPGXE1kVd5yor7QHuigyN/TA==");
        }
    }
}
