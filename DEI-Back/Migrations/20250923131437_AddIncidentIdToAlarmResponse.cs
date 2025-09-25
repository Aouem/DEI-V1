using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddIncidentIdToAlarmResponse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEIh4gDeMr9eBHXql/oikvxG8her/eZHOMr51Urg/wkUaJEeGWwdn+dgoe0TxYHIU8A==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEJt0/uzMi6F7ZoBFiyNHm/KMJvsSGUMZLa4+58r0rvYtHeW8H/isaDo//R0WqBx//w==");
        }
    }
}
