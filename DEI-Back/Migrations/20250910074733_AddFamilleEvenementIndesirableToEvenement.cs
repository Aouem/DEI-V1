using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class AddFamilleEvenementIndesirableToEvenement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEANsvV6rAsj1GyxTFW8LHN3gQoOGaZR12IIpXonm6g4slR+TUmN7yH/P5pRvrQKSNA==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAELFYlmX2cpB8b3NH+NmlcVs6uKd2SHaOWXNJIFWIIgTtDo0Q+CfD6aeCIrUutbrS8A==");
        }
    }
}
