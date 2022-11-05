using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One_Shop.Migrations
{
    public partial class AddedNewPropsToStorage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductLocation",
                table: "Storages",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProductRatings",
                table: "Storages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductLocation",
                table: "Storages");

            migrationBuilder.DropColumn(
                name: "ProductRatings",
                table: "Storages");
        }
    }
}
