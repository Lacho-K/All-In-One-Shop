using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One_Shop.Migrations
{
    public partial class ManyToMany : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Storages_ShoppingCarts_ShoppingCartId",
                table: "Storages");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_ShoppingCarts_ShoppingCartId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_ShoppingCartId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Storages_ShoppingCartId",
                table: "Storages");

            migrationBuilder.DropColumn(
                name: "ShoppingCartId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShoppingCartId",
                table: "Storages");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "ShoppingCarts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ShoppingCartStorage",
                columns: table => new
                {
                    ShoppingCartId = table.Column<int>(type: "int", nullable: false),
                    StorageId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShoppingCartStorage", x => new { x.ShoppingCartId, x.StorageId });
                    table.ForeignKey(
                        name: "FK_ShoppingCartStorage_ShoppingCarts_ShoppingCartId",
                        column: x => x.ShoppingCartId,
                        principalTable: "ShoppingCarts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ShoppingCartStorage_Storages_StorageId",
                        column: x => x.StorageId,
                        principalTable: "Storages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCarts_UserId",
                table: "ShoppingCarts",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShoppingCartStorage_StorageId",
                table: "ShoppingCartStorage",
                column: "StorageId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCarts_Users_UserId",
                table: "ShoppingCarts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCarts_Users_UserId",
                table: "ShoppingCarts");

            migrationBuilder.DropTable(
                name: "ShoppingCartStorage");

            migrationBuilder.DropIndex(
                name: "IX_ShoppingCarts_UserId",
                table: "ShoppingCarts");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ShoppingCarts");

            migrationBuilder.AddColumn<int>(
                name: "ShoppingCartId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ShoppingCartId",
                table: "Storages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_ShoppingCartId",
                table: "Users",
                column: "ShoppingCartId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Users_ShoppingCarts_ShoppingCartId",
                table: "Users",
                column: "ShoppingCartId",
                principalTable: "ShoppingCarts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
