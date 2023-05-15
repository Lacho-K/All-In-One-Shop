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
    public class ProductTypesControllerTests
    {
        private readonly Mock<IProductTypeInterface> _productTypeRepoMock;
        private readonly ProductTypesController _productTypeController;

        public ProductTypesControllerTests()
        {
            _productTypeRepoMock = new Mock<IProductTypeInterface>();
            _productTypeController = new ProductTypesController(_productTypeRepoMock.Object);
        }

        [Fact]
        public async Task GetProductsTypes_ReturnsAllProductTypes()
        {
            // Arrange
            var productTypes = new List<ProductType>()
            {
                new ProductType { Id = 1, ProductTypeStr = "Type1" },
                new ProductType { Id = 2, ProductTypeStr = "Type2" }
            };
            _productTypeRepoMock.Setup(repo => repo.GetAllProductTypes())
                .ReturnsAsync(productTypes);

            // Act
            var result = await _productTypeController.GetProductsTypes();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<ProductType>>>(result);
            var resultProductTypes = Assert.IsAssignableFrom<IEnumerable<ProductType>>(actionResult.Value);
            Assert.Equal(productTypes, resultProductTypes);
        }

        [Fact]
        public async Task GetProductType_WithValidId_ReturnsProductType()
        {
            // Arrange
            var id = 1;
            var productType = new ProductType { Id = id, ProductTypeStr = "Type1" };
            _productTypeRepoMock.Setup(repo => repo.GetProductTypeById(id))
                .ReturnsAsync(productType);

            // Act
            var result = await _productTypeController.GetProductType(id);

            // Assert
            var actionResult = Assert.IsType<ActionResult<ProductType>>(result);
            var resultProductType = Assert.IsAssignableFrom<ProductType>(actionResult.Value);
            Assert.Equal(id, resultProductType.Id);
        }

        [Fact]
        public async Task GetProductType_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var id = 1;

            // Act
            var result = await _productTypeController.GetProductType(id);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PutProductType_WithValidModel_ReturnsNoContent()
        {
            // Arrange
            var id = 1;
            var productType = new ProductType { Id = id, ProductTypeStr = "Type1" };

            _productTypeRepoMock.Setup(repo => repo.ProductTypeExists(id))
                .Returns(true);

            // Act
            var result = await _productTypeController.PutProductType(id, productType);

            // Assert
            Assert.IsType<NoContentResult>(result);
            _productTypeRepoMock.Verify(repo => repo.UpdateProductType(id, productType), Times.Once);
        }

        [Fact]
        public async Task PutProductType_WithInvalidId_ReturnsBadRequest()
        {
            // Arrange
            var id = 1;
            var productType = new ProductType { Id = 2, ProductTypeStr = "Type2" };

            // Act
            var result = await _productTypeController.PutProductType(id, productType);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]

        public async Task PutProductType_ReturnsNotFound_IfProductTypeDoesNotExist()
        {
            // Arrange 
            var id = 1;
            var productType = new ProductType { Id = 1, ProductTypeStr = "Type2" };

            _productTypeRepoMock.Setup(repo => repo.ProductTypeExists(id))
                .Returns(false);

            _productTypeRepoMock.Setup(repo => repo.UpdateProductType(id, productType))
                .Throws(new DbUpdateConcurrencyException());


            // Act
            var result = await _productTypeController.PutProductType(id, productType);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PostProductType_WithValidProductType_ReturnsCreatedAtAction()
        {
            // Arrange
            var productType = new ProductType { Id = 1, ProductTypeStr = "Type2" };

            _productTypeRepoMock.Setup(repo => repo.AddProductType(productType))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _productTypeController.PostProductType(productType);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdProductType = Assert.IsType<ProductType>(createdAtActionResult.Value);
            Assert.Equal(productType.Id, createdProductType.Id);
        }

        [Fact]
        public async Task DeleteProductType_WithExistingId_ReturnsNoContent()
        {
            // Arrange
            var id = 1;

            _productTypeRepoMock.Setup(repo => repo.DeleteProductType(id))
                .ReturnsAsync(new ProductType { Id = id });

            // Act
            var result = await _productTypeController.DeleteProductType(id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteProductType_WithNonExistingId_ReturnsNotFound()
        {
            // Arrange
            var id = 1;

            // Act
            var result = await _productTypeController.DeleteProductType(id);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

    }
}
