using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo
{
    public class ShoppingCartRepo : ShoppingCartInterface
    {
        private readonly DataContext _context;

        public ShoppingCartRepo(DataContext context)
        {
            _context = context;
        }

        public async Task AddShoppingCart(ShoppingCart shoppingCart)
        {
            await this._context.ShoppingCarts.AddAsync(shoppingCart);

            await this._context.SaveChangesAsync();
        }

        public async Task<ActionResult<ShoppingCart>> DeleteShoppingCart(int id)
        {
            var shoppingCart = await _context.ShoppingCarts.FindAsync(id);

            if (shoppingCart != null)
            {
                _context.ShoppingCarts.Remove(shoppingCart);
                await _context.SaveChangesAsync();
            }

            return shoppingCart;
        }

        public async Task<ActionResult<ShoppingCart>> GetShoppingCartById(int id)
        {
            var shoppingCart = await _context.ShoppingCarts.FindAsync(id);

            return shoppingCart;
        }

        public async Task<ActionResult<IEnumerable<Product>>> GetProductsInCart(int id)
        {
            var targetShoppingCart = await this.GetShoppingCartById(id);

            if(targetShoppingCart == null)
            {
                return null;
            }

            return targetShoppingCart.Value.products;
        }
        public async Task<string> AddProductToShoppingCart(int id, Product productToAdd)
        {
            var targetShoppingCart = await this.GetShoppingCartById(id);

            if(targetShoppingCart == null)
            {
                return "shopping cart not found!";
            }

            targetShoppingCart.Value.products.Append(productToAdd);

            return "";
        }

        public bool ProductExists(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateProduct(int id, Product product)
        {
            throw new NotImplementedException();
        }
    }
}
