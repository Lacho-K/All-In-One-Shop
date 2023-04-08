using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One_Shop.Models;
using All_In_One_Shop.Data.Repo;
using System.Threading.Tasks;
using All_In_One_Shop.Data.Repo.Interfaces;

namespace All_In_One_Shop.Data.Repo
{
    public class ProductRepo: IProductInterface
    {
        private readonly DataContext _context;

        public ProductRepo(DataContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<ActionResult<Product>> GetProductById(int id)
        {
            var product = await _context.Products.FindAsync(id);

            return product;
        }

        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByName(string input)
        {
            var products = await _context.Products.Where(p => p.Name.ToLower().Contains(input.ToLower())).ToListAsync();

            return products;
        }

        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByType(string type)
        {
            var products = await _context.Products
                .Where(p => p.ProductType.ProductTypeStr.ToLower() == type.ToLower()).ToListAsync();

            return products;
        }

        public async Task<ActionResult<IEnumerable<Product>>> GetFilteredProducts(string type, string name)
        {
            var productsToBeFiltered = await this.GetAllProducts();

            if(!String.IsNullOrEmpty(type))
            {
                productsToBeFiltered = await this.GetProductsByType(type);
            }

            var filteredProducts = String.IsNullOrEmpty(name) ? productsToBeFiltered : productsToBeFiltered.Value
                .Where(p => p.Name.ToLower().Contains(name.ToLower())).ToList();

            return filteredProducts;
        }

        public async Task AddProduct(Product product)
        {
            _context.Products.Add(product);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateProduct(int id, Product product)
        {
            _context.Products.Update(product);
            
            await _context.SaveChangesAsync();
        }

        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }

            return product;
        }

        public bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
