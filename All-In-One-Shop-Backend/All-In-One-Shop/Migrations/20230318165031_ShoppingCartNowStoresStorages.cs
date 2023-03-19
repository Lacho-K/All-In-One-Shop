using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One_Shop.Migrations
{
    public partial class ShoppingCartNowStoresStorages : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ShoppingCarts_ShoppingCartId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_ShoppingCartId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ShoppingCartId",
                table: "Products");

            migrationBuilder.AddColumn<int>(
                name: "ShoppingCartId",
                table: "Storages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Storages_ShoppingCartId",
                table: "Storages",
                column: "ShoppingCartId");

            migrationBuilder.AddForeignKey(
                name: "FK_Storages_ShoppingCarts_ShoppingCartId",
                table: "Storages",
                column: "ShoppingCartId",
                principalTable: "ShoppingCarts",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Storages_ShoppingCarts_ShoppingCartId",
                table: "Storages");

            migrationBuilder.DropIndex(
                name: "IX_Storages_ShoppingCartId",
                table: "Storages");

            migrationBuilder.DropColumn(
                name: "ShoppingCartId",
                table: "Storages");

            migrationBuilder.AddColumn<int>(
                name: "ShoppingCartId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_ShoppingCartId",
                table: "Products",
                column: "ShoppingCartId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ShoppingCarts_ShoppingCartId",
                table: "Products",
                column: "ShoppingCartId",
                principalTable: "ShoppingCarts",
                principalColumn: "Id");
        }
    }
}
