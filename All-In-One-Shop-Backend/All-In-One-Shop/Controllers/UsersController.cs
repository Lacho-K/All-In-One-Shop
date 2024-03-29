﻿using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Helpers;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserInterface _userRepo;

        public UsersController(IUserInterface userRepo)
        {
            this._userRepo = userRepo;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(User userObj)
        {
            if(userObj == null)
            {
                return BadRequest();
            }

            var user = await _userRepo.Authenticate(userObj);

            if (user.Value == null || !PasswordHasher.VerifyPassword(userObj.Password, user.Value.Password))
            {
                return BadRequest(new { Message = "Invalid username or password!" });
            }

            user.Value.Token = TokenGenerator.GenerateJwt(user.Value);

            return Ok(new
            {
                Token = user.Value.Token,
                Message = "Login success!"
            });       
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register(User userObj)
        {
            if(userObj == null)
            {
                return BadRequest();
            }

            string token = await this._userRepo.Register(userObj);

            return token == "" ? Ok(new { Message = "Register success!" }) : BadRequest(new {Message = token});
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await this._userRepo.GetAllUsers();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int id)
        {
            string token = await this._userRepo.DeleteUser(id);

            return token == "" ? Ok(new { Message = "Delete successful!" }) : NotFound(new { Message = token });
        }

    }
}
