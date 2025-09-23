using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEvenementCoordonnateur : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEKTVcZWfJJjTBvlCJqVFbykB4ZA5wLC2uydEZ5PXRhpOYAekDAcn5xeJ2jrEgT3sYw==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEE7xLVR6Nh92KwEwmRESNX0fG1EEiDJAGWHGLFDSDs8VW9T/zeb5wEVAJjnbRB9zwg==");
        }
    }
}
