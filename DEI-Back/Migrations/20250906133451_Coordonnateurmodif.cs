using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class Coordonnateurmodif : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAELFYlmX2cpB8b3NH+NmlcVs6uKd2SHaOWXNJIFWIIgTtDo0Q+CfD6aeCIrUutbrS8A==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEFecM54jWcWl9pbmUZSdFJHWDBXxANUM3XTV6a9bINlDDYHEW1u5zPvm4lu5N2T8dA==");
        }
    }
}
