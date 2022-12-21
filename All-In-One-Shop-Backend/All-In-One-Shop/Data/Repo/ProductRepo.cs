using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One_Shop.Models;
using All_In_One_Shop.Data.Repo;
using System.Threading.Tasks;

namespace All_In_One_Shop.Data.Repo
{
    public class ProductRepo: IProductInterface
    {
        private readonly static DataContext _context = new DataContext();

        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            return product;
        }

        public async Task<ActionResult<Product>> Post(Product product)
        {
            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            _context.Entry(product).State = EntityState.Detached;

            return product;
        }

        public async Task<ActionResult<Product>> Put(int id, Product product)
        {            
            _context.Entry(product).State = EntityState.Modified;
            
            await _context.SaveChangesAsync();

            _context.Entry(product).State = EntityState.Detached;

            return product;
        }

        public async Task<ActionResult<Product>> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }

            return product;
        }

        public bool Exists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
