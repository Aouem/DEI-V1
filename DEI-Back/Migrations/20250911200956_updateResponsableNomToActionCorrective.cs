using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class updateResponsableNomToActionCorrective : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEP3EHUgE4yx3THA1xFEWXaeWe6W9WGoyupaKUrksPQq3MuN/fRSrnGOD2w8Mioc0ew==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEI17Kn4AF46PI5S0xl99+VAvIDCClpr6L17ZMCE4XOl1NvqBhiX1Ad/WiRYQYk8Uag==");
        }
    }
}
