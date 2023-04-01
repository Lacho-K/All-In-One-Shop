using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface IProductInterface 
    {
        Task<ActionResult<IEnumerable<Product>>> GetAllProducts();

        Task<ActionResult<Product>> GetProductById(int id);

        Task<ActionResult<IEnumerable<Product>>> GetProductsByName(string name);

        Task UpdateProduct(int id, Product product);

        Task AddProduct(Product product);

        Task<ActionResult<Product>> DeleteProduct(int id);

        bool ProductExists(int id);
    }
}
