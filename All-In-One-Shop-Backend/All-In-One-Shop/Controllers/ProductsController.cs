﻿using System;
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
using Microsoft.AspNetCore.Authorization;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductInterface _productRepo;

        public ProductsController(IProductInterface productRepo)
        {
            this._productRepo = productRepo;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await this._productRepo.GetAllProducts();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _productRepo.GetProductById(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        [HttpGet("name")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByName(string? name)
        {
            if(name == "" || name == null)
            {
                return await this.GetProducts();
            }

            var products = await _productRepo.GetProductsByName(name);

            return products;
        }

        [HttpGet("type")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByType(string? type)
        {
            if (type == "" || type == null)
            {
                return await this.GetProducts();
            }

            var products = await _productRepo.GetProductsByType(type);

            return products;
        }

        [HttpGet("filtered")]
        public async Task<ActionResult<IEnumerable<Product>>> GetFilteredProducts(string? type, string? name)
        {
            if(String.IsNullOrEmpty(type) && String.IsNullOrEmpty(name))
            {
                return await this.GetProducts();
            }
            else if(String.IsNullOrEmpty(type) && !String.IsNullOrEmpty(name))
            {
                return await this.GetProductsByName(name);
            }
            else if(!String.IsNullOrEmpty(type) && String.IsNullOrEmpty(name))
            {
                return await this.GetProductsByType(type);
            }
            else
            {
                return await _productRepo.GetFilteredProducts(type, name);
            }
        }


        // PUT: api/Products/5
        [HttpPut("{id}")]
        [Authorize]

        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            try
            {
                await _productRepo.UpdateProduct(id, product);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_productRepo.ProductExists(id))
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

        // POST: api/Products
        [HttpPost]
        [Authorize]

        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            await _productRepo.AddProduct(product);

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        [Authorize]

        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _productRepo.DeleteProduct(id);

            if (product == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
