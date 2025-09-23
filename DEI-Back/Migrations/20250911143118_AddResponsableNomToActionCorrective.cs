using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddResponsableNomToActionCorrective : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAELffbMUDpy4jRrCsxJ/DkwBZ5oQClikO/l4GLT0AoJXZtjWOiIGPRp4yUOtxMuTITg==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEIi5tM8ZqMYcv3lSlwAW3LQIq60rp0fn0Nxx7OaMcy1FGRuhW66OdCla24ZRETAYyQ==");
        }
    }
}
