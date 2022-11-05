using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace All_In_One_Shop.Migrations
{
    public partial class AddedProductTypesDbSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductType_ProductTypeId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductType",
                table: "ProductType");

            migrationBuilder.RenameTable(
                name: "ProductType",
                newName: "ProductsTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductsTypes",
                table: "ProductsTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductsTypes_ProductTypeId",
                table: "Products",
                column: "ProductTypeId",
                principalTable: "ProductsTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductsTypes_ProductTypeId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductsTypes",
                table: "ProductsTypes");

            migrationBuilder.RenameTable(
                name: "ProductsTypes",
                newName: "ProductType");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductType",
                table: "ProductType",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductType_ProductTypeId",
                table: "Products",
                column: "ProductTypeId",
                principalTable: "ProductType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
