using All_In_One_Shop.Controllers;
using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Helpers;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace All_In_One_Shop.Tests
{
    public class UsersControllerTests
    {
        private readonly Mock<IUserInterface> _userRepoMock;
        private readonly UsersController _controller;

        public UsersControllerTests()
        {
            _userRepoMock = new Mock<IUserInterface>();
            _controller = new UsersController(_userRepoMock.Object);
        }

        [Fact]
        public async Task Authenticate_ValidUser_ReturnsOkResult()
        {
            // Arrange
            var id = 1;
            var password = "testPassword";
            var user = new User { Id = id, Password = password};
            var expectedMessage = "Login success!";
            _userRepoMock.Setup(repo => repo.Authenticate(user))
                .ReturnsAsync(new User { Id = id, FirstName="Test", LastName = "User", Role = "User", Password = PasswordHasher.HashPassword(password)});

            // Act
            var result = await _controller.Authenticate(user);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var messageProperty = okResult.Value.GetType().GetProperty("Message");
            var messageValue = messageProperty.GetValue(okResult.Value);
            Assert.Equal(expectedMessage, messageValue);
        }

        [Fact]
        public async Task Authenticate_InvalidUser_ReturnsBadRequest()
        {
            // Arrange
            var user = new User { Username = "testuser", Password = "password" };
            _userRepoMock.Setup(repo => repo.Authenticate(user))
                .ReturnsAsync(new BadRequestObjectResult(new { Message = "Invalid username or password!" }));

            // Act
            var result = await _controller.Authenticate(user);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task Authenticate_NullUser_ReturnsBadRequest()
        {
            // Arrange

            // Act
            var result = await _controller.Authenticate(null);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task Register_ValidUser_ReturnsOkResult()
        {
            // Arrange
            var user = new User { Username = "testuser", Password = "password" };
            var expectedMessage = "Register success!";
            _userRepoMock.Setup(repo => repo.Register(user))
                .ReturnsAsync("");

            // Act
            var result = await _controller.Register(user);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            var okResult = result as OkObjectResult;
            var messageProperty = okResult.Value.GetType().GetProperty("Message");
            var messageValue = messageProperty.GetValue(okResult.Value);
            Assert.Equal(expectedMessage, messageValue);
        }

        [Fact]
        public async Task Register_InvalidUser_ReturnsBadRequest()
        {
            // Arrange
            var user = new User { Username = "testuser", Password = "password" };
            var expectedMessage = "Username already exists!";

            _userRepoMock.Setup(repo => repo.Register(user)).ReturnsAsync(expectedMessage);

            // Act
            var result = await _controller.Register(user);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            var badResult = result as BadRequestObjectResult;
            var messageProperty = badResult.Value.GetType().GetProperty("Message");
            var messageValue = messageProperty.GetValue(badResult.Value);
            Assert.Equal(expectedMessage, messageValue);
        }

        [Fact]
        public async Task Register_NullUser_ReturnsBadRequest()
        {
            // Arrange

            // Act
            var result = await _controller.Register(null);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task GetAllUsers_ReturnsOkObjectResult_WithListOfUsers()
        {
            // Arrange
            var users = new List<User>
            {
            new User { Id = 1, Username = "user1" },
            new User { Id = 2, Username = "user2" }
            };

            _userRepoMock.Setup(repo => repo.GetAllUsers())
                .ReturnsAsync(users);

            // Act
            var result = await _controller.GetAllUsers();

            // Assert
            var model = Assert.IsAssignableFrom<IEnumerable<User>>(result.Value);
            Assert.Equal(users.Count, model.Count());
        }

        [Fact]
        public async Task DeleteUser_WithValidId_ReturnsOkObjectResult_WithSuccessMessage()
        {
            // Arrange
            var id = 1;
            var expectedMessage = "Delete successful!";
            _userRepoMock.Setup(repo => repo.DeleteUser(id))
                .ReturnsAsync("");

            // Act
            var result = await _controller.DeleteUser(id);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var messageProperty = okResult.Value.GetType().GetProperty("Message");
            var messageValue = messageProperty.GetValue(okResult.Value);
            Assert.Equal(expectedMessage, messageValue);
        }

        [Fact]
        public async Task DeleteUser_WithInvalidId_ReturnsNotFoundObjectResult_WithErrorMessage()
        {
            // Arrange
            var id = 1;
            var errorMessage = "User not found";
            _userRepoMock.Setup(repo => repo.DeleteUser(id)).ReturnsAsync(errorMessage);

            // Act
            var result = await _controller.DeleteUser(id);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            var messageProperty = notFoundResult.Value.GetType().GetProperty("Message");
            var messageValue = messageProperty.GetValue(notFoundResult.Value);
            Assert.Equal(errorMessage, messageValue);
        }
    }
}