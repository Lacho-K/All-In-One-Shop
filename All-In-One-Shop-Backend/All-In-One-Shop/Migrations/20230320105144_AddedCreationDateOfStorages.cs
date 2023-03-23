using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One_Shop.Migrations
{
    public partial class AddedCreationDateOfStorages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateCreated",
                table: "Storages",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateCreated",
                table: "Storages");
        }
    }
}
