using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddSchemaUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Evenements",
                newName: "SchemaUrl");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEJt0/uzMi6F7ZoBFiyNHm/KMJvsSGUMZLa4+58r0rvYtHeW8H/isaDo//R0WqBx//w==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SchemaUrl",
                table: "Evenements",
                newName: "ImageUrl");

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEAT4WayAu2HKKSa/d7Ql5710SKIMETWat6mmo2qclhuNJQqRpZ3PQmN0b9QiAHt3lw==");
        }
    }
}
