using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class updatesResponsableNomToActionCorrective : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEPfFpL2ug3fRwJtJXLtmlYUC8NsFjMRCL4w40gKC96ifG8In9lEWTSShT9xceVwnrA==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEP3EHUgE4yx3THA1xFEWXaeWe6W9WGoyupaKUrksPQq3MuN/fRSrnGOD2w8Mioc0ew==");
        }
    }
}
