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
    public class StoragesControllerTests
    {
        private readonly Mock<IStorageInterface> _storageRepoMock;
        private readonly StoragesController _controller;

        public StoragesControllerTests()
        {
            _storageRepoMock = new Mock<IStorageInterface>();
            _controller = new StoragesController(_storageRepoMock.Object);
        }

        [Fact]
        public async Task GetStorages_ReturnsOkResult()
        {
            // Arrange
            var storages = new List<Storage> { new Storage(), new Storage() };
            _storageRepoMock.Setup(repo => repo.GetAllStorages())
                .ReturnsAsync(storages);

            // Act
            var result = await _controller.GetStorages();

            // Assert
            var returnedStorages = Assert.IsAssignableFrom<IEnumerable<Storage>>(result.Value);
            Assert.Equal(storages.Count, returnedStorages.Count());
        }

        [Fact]
        public async Task GetStorage_ReturnsNotFoundResult_WhenStorageIsNull()
        {
            // Arrange
            var id = 1;

            // Act
            var result = await _controller.GetStorage(id);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetStorage_ReturnsOkResult_WhenStorageIsNotNull()
        {
            // Arrange
            var id = 1;
            var storage = new Storage();
            _storageRepoMock.Setup(repo => repo.GetStorageById(id))
                .ReturnsAsync(storage);

            // Act
            var result = await _controller.GetStorage(id);

            // Assert
            var returnedStorage = Assert.IsAssignableFrom<Storage>(result.Value);
            Assert.Equal(storage, returnedStorage);
        }

        [Fact]
        public async Task GetStoragebyProductId_ReturnsNotFoundResult_WhenStorageIsNull()
        {
            // Arrange
            var id = 1;

            // Act
            var result = await _controller.GetStoragebyProductId(id);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetStoragebyProductId_ReturnsOkResult_WhenStorageIsNotNull()
        {
            // Arrange
            var id = 1;
            var storage = new Storage();
            _storageRepoMock.Setup(repo => repo.GetStorageByProductId(id))
                .ReturnsAsync(storage);

            // Act
            var result = await _controller.GetStoragebyProductId(id);

            // Assert
            var returnedStorage = Assert.IsAssignableFrom<Storage>(result.Value);
            Assert.Equal(storage, returnedStorage);
        }

        [Fact]
        public async Task PutStorage_ReturnsBadRequestResult_WhenIdDoesNotMatch()
        {
            // Arrange
            int id = 1;
            var storage = new Storage { Id = 2 };

            // Act
            var result = await _controller.PutStorage(id, storage);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutStorage_ReturnsNoContentResult_WhenUpdateSucceeds()
        {
            // Arrange
            int id = 1;
            var storage = new Storage { Id = id };

            _storageRepoMock.Setup(repo => repo.UpdateStorage(id, storage))
                            .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PutStorage(id, storage);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task PutStorage_ReturnsNotFoundResult_WhenUpdateThrowsDbUpdateConcurrencyException()
        {
            // Arrange
            int id = 1;
            var storage = new Storage { Id = id };

            _storageRepoMock.Setup(repo => repo.UpdateStorage(id, storage))
                            .ThrowsAsync(new DbUpdateConcurrencyException());

            _storageRepoMock.Setup(repo => repo.StorageExists(id))
                            .Returns(false);

            // Act
            var result = await _controller.PutStorage(id, storage);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PostStorage_ReturnsCreatedAtActionResult_WhenAddSucceeds()
        {
            // Arrange
            var storage = new Storage { Id = 1 };

            _storageRepoMock.Setup(repo => repo.AddStorage(storage))
                            .Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PostStorage(storage);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal("GetStorage", createdAtActionResult.ActionName);
            Assert.Equal(storage.Id, createdAtActionResult.RouteValues["id"]);
            Assert.Equal(storage, createdAtActionResult.Value);
        }

        [Fact]
        public async Task DeleteStorage_ReturnsNoContentResult_WhenDeleteSucceeds()
        {
            // Arrange
            int id = 1;
            var storage = new Storage { Id = id };

            _storageRepoMock.Setup(repo => repo.DeleteStorage(id))
                            .ReturnsAsync(storage);

            // Act
            var result = await _controller.DeleteStorage(id);

            // Assert
            var noContentResult = Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task DeleteStorage_ReturnsNotFoundResult_WhenDeleteReturnsNull()
        {
            // Arrange
            int id = 1;


            // Act
            var result = await _controller.DeleteStorage(id);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }
    }
}
