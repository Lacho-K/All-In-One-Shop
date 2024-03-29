﻿using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface IProductTypeInterface
    {
        Task<ActionResult<IEnumerable<ProductType>>> GetAllProductTypes();

        Task<ActionResult<ProductType>> GetProductTypeById(int id);

        Task UpdateProductType(int id, ProductType product);

        Task AddProductType(ProductType product);

        Task<ActionResult<ProductType>> DeleteProductType(int id);

        bool ProductTypeExists(int id);
    }
}
