using All_In_One_Shop.Data.Repo.Interfaces;
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
                .FirstOrDefaultAsync(u => u.Username == userObj.Username && u.Password == userObj.Password);

            return user;
        }

        public async Task Register(User userObj)
        {
            await _context.Users.AddAsync(userObj);
            await _context.SaveChangesAsync();
        }
    }
}
