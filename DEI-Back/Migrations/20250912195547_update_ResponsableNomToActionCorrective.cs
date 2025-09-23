using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class update_ResponsableNomToActionCorrective : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEIb4JpKtEKRvTBrq0OTWFEI8T83F/wtYi7IoJ9y+eM6E7KgRvhag7Z+c1gGnvSTzfQ==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEDr1aLF5HFQC5Ogm8BHqyIn16C3CqXKfuJn+SHEN9cXVreGeBFMXspW+2CRaq4o/1A==");
        }
    }
}
