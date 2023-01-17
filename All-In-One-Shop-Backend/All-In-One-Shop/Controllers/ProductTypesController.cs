using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One_Shop.Data;
using All_In_One_Shop.Models;
using All_In_One_Shop.Data.Repo.Interfaces;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductTypesController : ControllerBase
    {
        private readonly IProductTypeInterface _productTypeRepo;

        public ProductTypesController(IProductTypeInterface productTypeRepo)
        {
            this._productTypeRepo = productTypeRepo;
        }

        // GET: api/ProductTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductType>>> GetProductsTypes()
        {
            return await _productTypeRepo.GetAllProductTypes();
        }

        // GET: api/ProductTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductType>> GetProductType(int id)
        {
            var productType = await _productTypeRepo.GetProductTypeById(id);

            if (productType == null)
            {
                return NotFound();
            }

            return productType;
        }

        // PUT: api/ProductTypes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductType(int id, ProductType productType)
        {
            if (id != productType.Id)
            {
                return BadRequest();
            }

            try
            {

                await _productTypeRepo.UpdateProductType(id, productType);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_productTypeRepo.ProductTypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ProductTypes
        [HttpPost]
        public async Task<ActionResult<ProductType>> PostProductType(ProductType productType)
        {
            await _productTypeRepo.AddProductType(productType);

            return CreatedAtAction("GetProductType", new { id = productType.Id }, productType);
        }

        // DELETE: api/ProductTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductType(int id)
        {
            var productType = await _productTypeRepo.DeleteProductType(id);

            if (productType == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
