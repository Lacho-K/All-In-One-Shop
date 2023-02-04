﻿using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Helpers;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserInterface _userRepo;
        private readonly ITokenInterface _tokenRepo;

        public UsersController(IUserInterface userRepo, ITokenInterface tokenRepo)
        {
            this._userRepo = userRepo;
            this._tokenRepo = tokenRepo;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(User userObj)
        {
            if(userObj == null)
            {
                return BadRequest();
            }

            var user = await _userRepo.Authenticate(userObj);

            if (user.Value == null)
            {
                return NotFound(new { Message = "User Not found!" });
            }

            if (!PasswordHasher.VerifyPassword(userObj.Password, user.Value.Password))
            {
                return BadRequest(new { Message = "Invalid Password!" });
            }

            user.Value.Token = _tokenRepo.GenerateJwt(user.Value);

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

            return token == null ? Ok(new { Message = "Register success!" }) : BadRequest(new {Message = token});
        }
    }
}
