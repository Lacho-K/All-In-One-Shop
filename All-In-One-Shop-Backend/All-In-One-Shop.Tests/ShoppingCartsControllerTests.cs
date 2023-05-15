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
    public class ShoppingCartsControllerTests
    {
        private readonly Mock<IShoppingCartInterface> _shoppingCartRepoMock;
        private readonly ShoppingCartsController _shoppingCartController;

        public ShoppingCartsControllerTests()
        {
            _shoppingCartRepoMock = new Mock<IShoppingCartInterface>();
            _shoppingCartController = new ShoppingCartsController(_shoppingCartRepoMock.Object);
        }

        [Fact]
        public async Task GetShoppingCarts_ReturnsOkObjectResult_WithShoppingCartList()
        {
            // Arrange
            var expectedShoppingCarts = new List<ShoppingCart>()
            {
                new ShoppingCart() { Id = 1, UserId = 1 },
                new ShoppingCart() { Id = 2, UserId = 2 }
            };

            _shoppingCartRepoMock.Setup(repo => repo.GetAllCarts())
                .ReturnsAsync(expectedShoppingCarts);

            // Act
            var result = await _shoppingCartController.GetShoppingCarts();

            // Assert
            var actualShoppingCarts = Assert.IsType<List<ShoppingCart>>(result.Value);
            Assert.Equal(expectedShoppingCarts, actualShoppingCarts);
        }

        [Fact]
        public async Task GetShoppingCartById_WithValidId_ReturnsShoppingCart()
        {
            // Arrange
            var expectedShoppingCart = new ShoppingCart() { Id = 1, UserId = 1 };
            _shoppingCartRepoMock.Setup(repo => repo.GetShoppingCartById(expectedShoppingCart.Id))
                .ReturnsAsync(expectedShoppingCart);

            // Act
            var result = await _shoppingCartController.GetShoppingCartById(expectedShoppingCart.Id);

            // Assert
            var actualShoppingCart = Assert.IsType<ShoppingCart>(result.Value);
            Assert.Equal(expectedShoppingCart, actualShoppingCart);
        }

        [Fact]
        public async Task GetShoppingCartById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            var invalidId = 999;

            // Act
            var result = await _shoppingCartController.GetShoppingCartById(invalidId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetShoppingCartByUserId_WithValidUserId_ReturnsShoppingCart()
        {
            // Arrange
            var expectedShoppingCart = new ShoppingCart() { Id = 1, UserId = 1 };
            _shoppingCartRepoMock.Setup(repo => repo.GetShoppingCartByUserId(expectedShoppingCart.UserId))
                .ReturnsAsync(expectedShoppingCart);

            // Act
            var result = await _shoppingCartController.GetShoppingCartByUserId(expectedShoppingCart.UserId);

            // Assert
            var actualShoppingCart = Assert.IsType<ShoppingCart>(result.Value);
            Assert.Equal(expectedShoppingCart, actualShoppingCart);
        }
        
        [Fact]
        public async Task GetShoppingCartByUserId_WithInValidUserId_ReturnsNotFound()
        {
            // Arrange
            var testCart = new ShoppingCart() { Id = 1, UserId = 1 };

            // Act
            var result = await _shoppingCartController.GetShoppingCartByUserId(testCart.UserId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
        
        [Fact]
        public async Task PostShoppingCart_WithValidId_ReturnsCreatedAtAction()
        {
            // Arrange
            var shoppingCart = new ShoppingCart() { Id = 1, UserId = 1 };

            _shoppingCartRepoMock.Setup(repo => repo.AddShoppingCart(shoppingCart))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _shoppingCartController.AddShoppingCart(shoppingCart);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdShoppingCart = Assert.IsType<ShoppingCart>(createdAtActionResult.Value);
            Assert.Equal(shoppingCart.Id, createdShoppingCart.Id);
        }

        [Fact]
        public async Task DeleteShoppingCart_WithExistingId_ReturnsNoContent()
        {
            // Arrange
            var id = 1;

            _shoppingCartRepoMock.Setup(repo => repo.DeleteShoppingCart(id))
                .ReturnsAsync(new ShoppingCart { Id = id });

            // Act
            var result = await _shoppingCartController.DeleteShoppingCart(id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteShoppingCart_WithNonExistingId_ReturnsNotFound()
        {
            // Arrange
            var id = 1;

            // Act
            var result = await _shoppingCartController.DeleteShoppingCart(id);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetStoragesInCart_ReturnsOkResult_WhenStoragesExist()
        {
            // Arrange
            int cartId = 1;
            var expectedStorages = new List<Storage>
            {
                new Storage { Id = 1 },
                new Storage { Id = 2 }
            };
            _shoppingCartRepoMock.Setup(repo => repo.GetStoragesByCartId(cartId))
                .ReturnsAsync(expectedStorages);

            // Act
            var result = await _shoppingCartController.GetStoragesInCart(cartId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Storage>>>(result);
            var actualStorages = Assert.IsType<List<Storage>>(actionResult.Value);
            Assert.Equal(expectedStorages.Count, actualStorages.Count);
            Assert.Equal(expectedStorages.First().Id, actualStorages.First().Id);
        }

        [Fact]
        public async Task GetStoragesInCart_ReturnsNotFoundResult_WhenStoragesDoNotExist()
        {
            // Arrange
            int cartId = 1;

            // Act
            var result = await _shoppingCartController.GetStoragesInCart(cartId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Storage>>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task AddStorageToShoppingCart_ReturnsOkResult_WhenStorageIsAddedSuccessfully()
        {
            // Arrange
            int cartId = 1;
            int storageId = 1;
            string expectedToken = "";
            _shoppingCartRepoMock.Setup(repo => repo.AddStorageToShoppingCart(cartId, storageId))
                .ReturnsAsync(expectedToken);

            // Act
            var result = await _shoppingCartController.AddStorageToShoppingCart(cartId, storageId);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task AddStorageToShoppingCart_ReturnsNotFoundResult_WhenStorageIsNotAddedSuccessfully()
        {
            // Arrange
            int cartId = 1;
            int storageId = 1;
            string expectedErrorMessage = "Error adding storage to shopping cart.";
            _shoppingCartRepoMock.Setup(repo => repo.AddStorageToShoppingCart(cartId, storageId))
                .ReturnsAsync(expectedErrorMessage);

            // Act
            var result = await _shoppingCartController.AddStorageToShoppingCart(cartId, storageId);

            // Assert
            var notFoundObjectResult = Assert.IsType<NotFoundObjectResult>(result);
            var actualErrorMessage = Assert.IsType<string>(notFoundObjectResult.Value);
            Assert.Equal(expectedErrorMessage, actualErrorMessage);
        }

        [Fact]
        public async Task DeleteStorageFromShoppingCart_ReturnsOk_WhenTokenIsEmpty()
        {
            // Arrange
            int cartId = 1;
            int storageId = 2;
            string token = "";

            _shoppingCartRepoMock
                .Setup(x => x.DeleteStorageFromShoppingCart(cartId, storageId))
                .ReturnsAsync(token);

            // Act
            var result = await _shoppingCartController.DeleteStorageFromShoppingCart(cartId, storageId);

            // Assert
            var okResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, okResult.StatusCode);
        }

        [Fact]
        public async Task DeleteStorageFromShoppingCart_ReturnsNotFound_WhenTokenIsNotEmpty()
        {
            // Arrange
            int cartId = 1;
            int storageId = 2;
            string expectedErrorMessage = "error";

            _shoppingCartRepoMock
                .Setup(x => x.DeleteStorageFromShoppingCart(cartId, storageId))
                .ReturnsAsync(expectedErrorMessage);

            // Act
            var result = await _shoppingCartController.DeleteStorageFromShoppingCart(cartId, storageId);

            // Assert
            var notFoundObjectResult = Assert.IsType<NotFoundObjectResult>(result);
            var actualErrorMessage = Assert.IsType<string>(notFoundObjectResult.Value);
            Assert.Equal(expectedErrorMessage, actualErrorMessage);
        }

        [Fact]
        public async Task ClearShoppingCart_ReturnsOk_WhenTokenIsEmpty()
        {
            // Arrange
            int cartId = 1;
            string token = "";

            _shoppingCartRepoMock
                .Setup(x => x.EmptyShoppingCart(cartId))
                .ReturnsAsync(token);

            // Act
            var result = await _shoppingCartController.ClearShoppingCart(cartId);

            // Assert
            var okResult = Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task ClearShoppingCart_ReturnsNotFound_WhenTokenIsNotEmpty()
        {
            // Arrange
            int cartId = 1;
            string expectedErrorMessage = "error";

            _shoppingCartRepoMock
                .Setup(x => x.EmptyShoppingCart(cartId))
                .ReturnsAsync(expectedErrorMessage);

            // Act
            var result = await _shoppingCartController.ClearShoppingCart(cartId);

            // Assert
            var notFoundObjectResult = Assert.IsType<NotFoundObjectResult>(result);
            var actualErrorMessage = Assert.IsType<string>(notFoundObjectResult.Value);
            Assert.Equal(expectedErrorMessage, actualErrorMessage);
        }

    }
}
