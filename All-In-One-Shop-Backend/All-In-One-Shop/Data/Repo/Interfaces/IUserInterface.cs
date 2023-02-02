using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface IUserInterface
    {
        Task<ActionResult<User>> Authenticate(User userObj);
        Task<string> Register(User userObj);
    }
}
