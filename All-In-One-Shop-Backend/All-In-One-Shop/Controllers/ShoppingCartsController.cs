using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One_Shop.Data;
using All_In_One_Shop.Models;
using All_In_One_Shop.Data.Repo;
using All_In_One_Shop.Data.Repo.Interfaces;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartsController : ControllerBase
    {
        private readonly IShoppingCartInterface _shoppingCartRepo;

        public ShoppingCartsController(IShoppingCartInterface shoppingCartRepo)
        {
            this._shoppingCartRepo = shoppingCartRepo;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShoppingCart>>> GetShoppingCarts()
        {
            return await this._shoppingCartRepo.GetAllCarts();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShoppingCart>> GetShoppingCartById(int id)
        {
            var shoppingCart = await _shoppingCartRepo.GetShoppingCartById(id);

            if (shoppingCart == null)
            {
                return NotFound();
            }

            return shoppingCart;
        }

        // PUT: api/Products/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutProduct(int id, Product product)
        //{
        //    if (id != product.Id)
        //    {
        //        return BadRequest();
        //    }

        //    try
        //    {
        //        await _productRepo.UpdateProduct(id, product);
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!_productRepo.ProductExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<ShoppingCart>> AddShoppingCart(ShoppingCart shoppingCart)
        {
            await _shoppingCartRepo.AddShoppingCart(shoppingCart);

            return CreatedAtAction("GetShoppingCartById", new { id = shoppingCart.Id }, shoppingCart);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShoppingCart(int id)
        {
            var shoppingCart = await _shoppingCartRepo.DeleteShoppingCart(id);

            if (shoppingCart == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("{id}/storages")]
        public async Task<ActionResult<IEnumerable<Storage>>> GetStoragesInCart(int id)
        {
            var storages = await _shoppingCartRepo.GetStoragesByCartId(id);

            if (storages == null)
            {
                return NotFound();
            }

            return storages;
        }

        [HttpPut("{id}/storages")]
        public async Task<IActionResult> AddStorageToShoppingCart(int cartId, int storageId)
        {
            var token = await this._shoppingCartRepo.AddStorageToShoppingCart(cartId, storageId);

            if(token == "")
            {
                return Ok();
            }

            return NotFound(token);
        }

        [HttpDelete("{id}/storages")]
        public async Task<IActionResult> DeleteStorageFromShoppingCart(int cartId, int storageId)
        {
            var token = await this._shoppingCartRepo.DeleteStorageFromShoppingCart(cartId, storageId);

            if (token == "")
            {
                return Ok();
            }

            return NotFound(token);
        }
    }
}
