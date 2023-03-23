using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace All_In_One_Shop.Data.Repo
{
    public class ShoppingCartRepo : IShoppingCartInterface
    {
        private readonly DataContext _context;

        public ShoppingCartRepo(DataContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<IEnumerable<ShoppingCart>>> GetAllCarts()
        {
            return await _context.ShoppingCarts.ToListAsync();
        }

        public async Task<ActionResult<ShoppingCart>> GetShoppingCartById(int id)
        {
            var shoppingCart = await _context.ShoppingCarts.FindAsync(id);

            return shoppingCart;
        }

        public async Task AddShoppingCart(ShoppingCart shoppingCart)
        {
            this._context.ShoppingCarts.Add(shoppingCart);

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

        public async Task<ActionResult<IEnumerable<Storage>>> GetStoragesByCartId(int id)
        {
            var shoppingCart = await _context.ShoppingCarts
                .Include(sc => sc.ShoppingCartStorages)
                .ThenInclude(ss => ss.Storage)
                .SingleOrDefaultAsync(sc => sc.Id == id);

            if(shoppingCart == null)
            {
                return null;
            }

            var storages = shoppingCart.ShoppingCartStorages
                .Select(ss => ss.Storage)
                .OrderBy(ss => ss.DateCreated);

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return new JsonResult(storages, options);
        }
        public async Task<string> AddStorageToShoppingCart(int id, int storageId)
        {
            var shoppingCart = await _context.ShoppingCarts
                .Include(sc => sc.ShoppingCartStorages)
                .ThenInclude(ss => ss.Storage)
                .SingleOrDefaultAsync(sc => sc.Id == id);

            var storageToAdd = await _context.Storages.FirstOrDefaultAsync(s => s.Id == storageId);

            storageToAdd.DateCreated = DateTime.Now;


            if(shoppingCart == null)
            {
                return "Not found!";
            }


            shoppingCart.ShoppingCartStorages.Add(new ShoppingCartStorage { ShoppingCartId = id, StorageId = storageId });

            _context.Update(shoppingCart);
            await _context.SaveChangesAsync();

            return "";

        }

        public async Task<string> DeleteStorageFromShoppingCart(int id, int storageId)
        {
            var shoppingCart = await _context.ShoppingCarts
                .Include(sc => sc.ShoppingCartStorages)
                .ThenInclude(ss => ss.Storage)
                .SingleOrDefaultAsync(sc => sc.Id == id);


            if (shoppingCart == null)
            {
                return "Not found!";
            }

            var shoppingCartItemToRemove = shoppingCart.ShoppingCartStorages.SingleOrDefault(s => s.StorageId == storageId);


            if (shoppingCartItemToRemove == null)
            {
                return "Not found!";
            }

            shoppingCart.ShoppingCartStorages.Remove(shoppingCartItemToRemove);

            _context.Update(shoppingCart);
            await _context.SaveChangesAsync();

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
