using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace All_In_One_Shop.Data.Repo
{
    public class ProductTypeRepo : IProductTypeInterface
    {
        private readonly DataContext _context;

        public ProductTypeRepo(DataContext context)
        {
            _context = context;
        }

        public async Task AddProductType(ProductType productType)
        {
            _context.ProductsTypes.Add(productType);

            await _context.SaveChangesAsync();
        }

        public async Task<ActionResult<ProductType>> DeleteProductType(int id)
        {
            var productType = await _context.ProductsTypes.FindAsync(id);

            if (productType != null)
            {
                _context.ProductsTypes.Remove(productType);
                await _context.SaveChangesAsync();
            }

            return productType;
        }

        public async Task<ActionResult<IEnumerable<ProductType>>> GetAllProductTypes()
        {
            return await _context.ProductsTypes.ToListAsync();
        }

        public async Task<ActionResult<ProductType>> GetProductTypeById(int id)
        {
            var productType = await _context.ProductsTypes.FindAsync(id);

            return productType;
        }

        public bool ProductTypeExists(int id)
        {
            return _context.ProductsTypes.Any(e => e.Id == id);
        }

        public async Task UpdateProductType(int id, ProductType productType)
        {
            _context.ProductsTypes.Update(productType);

            await _context.SaveChangesAsync();
        }
    }
}
