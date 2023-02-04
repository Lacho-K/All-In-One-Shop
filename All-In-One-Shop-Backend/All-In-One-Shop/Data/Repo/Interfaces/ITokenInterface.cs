using All_In_One_Shop.Models;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface ITokenInterface
    {
        string GenerateJwt(User userObj);
    }
}
