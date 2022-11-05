using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One_Shop.Data;
using All_In_One_Shop.Models;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductTypesController : ControllerBase
    {
        private readonly DataContext _context;

        public ProductTypesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/ProductTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductType>>> GetProductsTypes()
        {
            return await _context.ProductsTypes.ToListAsync();
        }

        // GET: api/ProductTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductType>> GetProductType(int id)
        {
            var productType = await _context.ProductsTypes.FindAsync(id);

            if (productType == null)
            {
                return NotFound();
            }

            return productType;
        }

        // PUT: api/ProductTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductType(int id, ProductType productType)
        {
            if (id != productType.Id)
            {
                return BadRequest();
            }

            _context.Entry(productType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductTypeExists(id))
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ProductType>> PostProductType(ProductType productType)
        {
            _context.ProductsTypes.Add(productType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductType", new { id = productType.Id }, productType);
        }

        // DELETE: api/ProductTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductType(int id)
        {
            var productType = await _context.ProductsTypes.FindAsync(id);
            if (productType == null)
            {
                return NotFound();
            }

            _context.ProductsTypes.Remove(productType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductTypeExists(int id)
        {
            return _context.ProductsTypes.Any(e => e.Id == id);
        }
    }
}
