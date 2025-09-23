using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class updatesResponsableNom_ToActionCorrective : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEDr1aLF5HFQC5Ogm8BHqyIn16C3CqXKfuJn+SHEN9cXVreGeBFMXspW+2CRaq4o/1A==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEPfFpL2ug3fRwJtJXLtmlYUC8NsFjMRCL4w40gKC96ifG8In9lEWTSShT9xceVwnrA==");
        }
    }
}
