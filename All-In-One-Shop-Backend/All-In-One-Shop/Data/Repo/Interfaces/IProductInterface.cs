using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo
{
    public interface IProductInterface 
    {
        Task<ActionResult<IEnumerable<Product>>> GetAll();

        Task<ActionResult<Product>> GetById(int id);

        Task<ActionResult<Product>> Put(int id, Product product);

        Task<ActionResult<Product>> Post(Product product);

        Task<ActionResult<Product>> Delete(int id);

        bool Exists(int id);
    }
}
