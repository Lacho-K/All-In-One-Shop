using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using All_In_One_Shop.Controllers;
using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace All_In_One_Shop.Tests
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductInterface> _productRepoMock;
        private readonly ProductsController _productsController;

        public ProductsControllerTests()
        {
            _productRepoMock = new Mock<IProductInterface>();
            _productsController = new ProductsController(_productRepoMock.Object);
        }

        [Fact]
        public async Task GetProducts_ReturnsListOfProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Product1", Description = "Type1", ProductImageURL = "", ProductTypeId = 1, Price = 10.00M},
                new Product { Id = 2, Name = "Product2", Description = "Type2", ProductImageURL = "", ProductTypeId = 2, Price = 10.00M }
            };

            _productRepoMock.Setup(repo => repo.GetAllProducts())
                .ReturnsAsync(products);

            // Act
            var result = await _productsController.GetProducts();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var actionValue = Assert.IsType<List<Product>>(actionResult.Value);
            Assert.Equal(products, actionValue);
        }

        [Fact]
        public async Task GetProduct_WithValidId_ReturnsProduct()
        {
            // Arrange
            var product = new Product { Id = 1, Name = "Product1", Description = "Type1", ProductImageURL = "", ProductTypeId = 1, Price = 10.00M };
            var id = 1;

            _productRepoMock.Setup(repo => repo.GetProductById(id))
                .ReturnsAsync(product);

            // Act
            var result = await _productsController.GetProduct(id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Product>>(result);
            var actionValue = Assert.IsType<Product>(actionResult.Value);
            Assert.Equal(product, actionValue);
        }

        [Fact]
        public async Task GetProduct_ReturnsNotFound_IfEntityIsNotFound()
        {
            // Arrange
            var id = 1;

            // Act
            var getByIdTask = await _productsController.GetProduct(id);

            // Assert
            Assert.IsType<NotFoundResult>(getByIdTask.Result);
        }

        [Fact]
        public async Task GetProductsByName_WithNullName_ReturnsAllProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Product1", Description = "Type1", ProductImageURL = "", ProductTypeId = 1, Price = 10.00M},
                new Product { Id = 2, Name = "Product2", Description = "Type2", ProductImageURL = "", ProductTypeId = 2, Price = 10.00M }
            };

            _productRepoMock.Setup(repo => repo.GetAllProducts())
                .ReturnsAsync(products);

            // Act
            var result = await _productsController.GetProductsByName(null);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var actionValue = Assert.IsType<List<Product>>(actionResult.Value);
            _productRepoMock.Verify(repo => repo.GetAllProducts(), Times.Once);
            Assert.Equal(products, actionValue);
        }

        [Fact]
        public async Task GetProductsByType_WithNullType_ReturnsAllProducts()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Product1", Description = "Type1", ProductImageURL = "", ProductTypeId = 1, Price = 10.00M},
                new Product { Id = 2, Name = "Product2", Description = "Type2", ProductImageURL = "", ProductTypeId = 2, Price = 10.00M }
            };

            _productRepoMock.Setup(repo => repo.GetAllProducts())
                .ReturnsAsync(products);

            // Act
            var result = await _productsController.GetProductsByType(null);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var actionValue = Assert.IsType<List<Product>>(actionResult.Value);
            _productRepoMock.Verify(repo => repo.GetAllProducts(), Times.Once);
            Assert.Equal(products, actionValue);
        }

        [Fact]
        public async Task GetFilteredProducts_WithNullTypeAndNullName_ReturnsAllProducts()
        {
            // Arrange
            var allProducts = new List<Product>
            {
                new Product { Id = 1, Name = "Product1", Description = "Type1", ProductImageURL = "", ProductTypeId = 1, Price = 10.00M},
                new Product { Id = 2, Name = "Product2", Description = "Type2", ProductImageURL = "", ProductTypeId = 2, Price = 10.00M }
            };

            _productRepoMock.Setup(repo => repo.GetAllProducts())
                .ReturnsAsync(allProducts);

            // Act
            var result = await _productsController.GetFilteredProducts(null, null);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(actionResult.Value);
            Assert.Equal(allProducts, products);
        }

        [Fact]
        public async Task GetFilteredProducts_WithNullTypeAndValidName_ReturnsProductsByName()
        {
            // Arrange
            var name = "Product";

            var products = new List<Product>
            {
                new Product { Id = 1, Name = name, Description = "Type1", ProductImageURL = "", ProductTypeId = 1, Price = 10.00M}
            };

            _productRepoMock.Setup(repo => repo.GetProductsByName(name))
                .ReturnsAsync(products);

            // Act
            var result = await _productsController.GetFilteredProducts(null, name);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var returnedProducts = Assert.IsAssignableFrom<IEnumerable<Product>>(actionResult.Value);
            Assert.Equal(products.Count, returnedProducts.Count());
            Assert.Equal(products, returnedProducts);
        }

        [Fact]
        public async Task GetFilteredProducts_WithValidTypeAndNullName_ReturnsProductsByType()
        {
            // Arrange
            var type = "Type";
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Product1", Description = type, ProductImageURL = "", ProductTypeId = 1, Price = 10.00M}
            };
            _productRepoMock.Setup(repo => repo.GetProductsByType(type))
                .ReturnsAsync(products);

            // Act
            var result = await _productsController.GetFilteredProducts(type, null);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var returnedProducts = Assert.IsAssignableFrom<IEnumerable<Product>>(actionResult.Value);
            Assert.Equal(products.Count, returnedProducts.Count());
            Assert.Equal(products, returnedProducts);
        }

        [Fact]
        public async Task GetFilteredProducts_WithValidTypeAndValidName_ReturnsFilteredProducts()
        {
            // Arrange
            var type = "Type";
            var name = "Product";
            var products = new List<Product>
            {
                new Product { Id = 1, Name = name, Description = type, ProductImageURL = "", ProductTypeId = 1, Price = 10.00M}
            };

            _productRepoMock.Setup(repo => repo.GetFilteredProducts(type, name))
                .ReturnsAsync(products);

            // Act
            var result = await _productsController.GetFilteredProducts(type, name);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Product>>>(result);
            var returnedProducts = Assert.IsAssignableFrom<IEnumerable<Product>>(actionResult.Value);
            Assert.Equal(products.Count, returnedProducts.Count());
            Assert.Equal(products, returnedProducts);
        }

        [Fact]
        public async Task PutProduct_WithNonMatchingIds_ReturnsBadRequest()
        {
            // Arrange

            int id = 1;
            Product testProduct = new Product { Id = 2 };

            // Act

            var putTask = _productsController.PutProduct(id, testProduct);

            // Assert

            Assert.IsType<BadRequestResult>(putTask.Result);
        }
        
        [Fact]
        public async Task PutProduct_WithMatchingIds_ReturnsNoContent()
        {
            // Arrange

            int id = 1;
            Product testProduct = new Product { Id = 1 };

            // Act

            var putTask = _productsController.PutProduct(id, testProduct);

            // Assert

            Assert.IsType<NoContentResult>(putTask.Result);
        }
        
        [Fact]
        public async Task PutProduct_ReturnsNotFound_IfProductDoesNotExist()
        {
            // Arrange

            int id = 1;
            Product testProduct = new Product { Id = 1 };

            _productRepoMock.Setup(repo => repo.UpdateProduct(id, testProduct))
            .Throws(new DbUpdateConcurrencyException());

            _productRepoMock.Setup(repo => repo.ProductExists(id))
                .Returns(false);

            // Act

            var putTask = _productsController.PutProduct(id, testProduct);

            // Assert

            Assert.IsType<NotFoundResult>(putTask.Result);
        }

        [Fact]
        public async Task PostProduct_WithValidProduct_ReturnsCreatedAtAction()
        {
            // Arrange
            var product = new Product { Id = 1 };

            _productRepoMock.Setup(repo => repo.AddProduct(product))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _productsController.PostProduct(product);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdProduct = Assert.IsType<Product>(createdAtActionResult.Value);
            Assert.Equal(product.Id, createdProduct.Id);
        }

        [Fact]
        public async Task DeleteProduct_WithExistingId_ReturnsNoContent()
        {
            // Arrange
            var id = 1;

            _productRepoMock.Setup(repo => repo.DeleteProduct(id))
                .ReturnsAsync(new Product { Id = id });

            // Act
            var result = await _productsController.DeleteProduct(id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
        
        [Fact]
        public async Task DeleteProduct_WithNonExistingId_ReturnsNotFound()
        {
            // Arrange
            var id = 1;

            // Act
            var result = await _productsController.DeleteProduct(id);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

    }
}