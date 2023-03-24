using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface IShoppingCartInterface
    {
        Task<ActionResult<IEnumerable<ShoppingCart>>> GetAllCarts();

        Task AddShoppingCart(ShoppingCart shoppingCart);

        Task<ActionResult<ShoppingCart>> DeleteShoppingCart(int id);

        Task<ActionResult<ShoppingCart>> GetShoppingCartById(int id);

        Task<ActionResult<ShoppingCart>> GetShoppingCartByUserId(int userId);

        Task<ActionResult<IEnumerable<Storage>>> GetStoragesByCartId(int id);

        Task<string> AddStorageToShoppingCart(int cartId, int storageId);

        Task<string> DeleteStorageFromShoppingCart(int id, int storageId);
    }
}
