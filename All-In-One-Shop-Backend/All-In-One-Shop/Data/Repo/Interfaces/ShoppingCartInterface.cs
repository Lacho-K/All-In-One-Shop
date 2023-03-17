using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface ShoppingCartInterface
    {
        Task<ActionResult<IEnumerable<Product>>> GetProductsInCart();

        Task<ActionResult<Product>> GetProductById(int id);

        Task UpdateProduct(int id, Product product);

        Task AddShoppingCart(ShoppingCart product);

        Task<ActionResult<Product>> DeleteProduct(int id);

        bool ProductExists(int id);
    }
}
