using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Helpers;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace All_In_One_Shop.Data.Repo
{
    public class UserRepo : IUserInterface
    {
        private readonly DataContext _context;

        public UserRepo(DataContext context)
        {
            _context = context;
        }

        public async Task<ActionResult<User>> Authenticate(User userObj)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == userObj.Username);

            return user;           
        }

        public async Task<string> Register(User userObj)
        {
            if (await CheckUserNameExist(userObj.Username))
            {
                return "Username already exists!";
            }

            if(await CheckEmailExist(userObj.Email))
            {
                return "Email already exists!";
            }

            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "Admin";
            userObj.Token = "";

            await _context.Users.AddAsync(userObj);
            await _context.SaveChangesAsync();

            return null;
        }

        private async Task<bool> CheckUserNameExist(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }
        private async Task<bool> CheckEmailExist(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }
    }
}
