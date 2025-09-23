using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DEI.Migrations
{
    /// <inheritdoc />
    public partial class Coordonnateur : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Fournisseur",
                table: "Evenements",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "CausesImmediates",
                table: "Evenements",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CausesProfondes",
                table: "Evenements",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DateCloture",
                table: "Evenements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EvaluationDate",
                table: "Evenements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EvaluationEfficace",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "EvaluationInefficace",
                table: "Evenements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EvaluationResponsable",
                table: "Evenements",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEFecM54jWcWl9pbmUZSdFJHWDBXxANUM3XTV6a9bINlDDYHEW1u5zPvm4lu5N2T8dA==");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CausesImmediates",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "CausesProfondes",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "DateCloture",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EvaluationDate",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EvaluationEfficace",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EvaluationInefficace",
                table: "Evenements");

            migrationBuilder.DropColumn(
                name: "EvaluationResponsable",
                table: "Evenements");

            migrationBuilder.AlterColumn<bool>(
                name: "Fournisseur",
                table: "Evenements",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Utilisateurs",
                keyColumn: "Id",
                keyValue: "1",
                column: "Password",
                value: "AQAAAAIAAYagAAAAEBH+UewwCw1T2YAER1Bk/PfUYtUzMOb054H0AYaV+s4gUJD33/tRp5yaqtDxPEeH6A==");
        }
    }
}
