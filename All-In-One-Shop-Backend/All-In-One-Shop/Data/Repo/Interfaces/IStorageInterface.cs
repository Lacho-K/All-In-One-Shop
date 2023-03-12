using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;

namespace All_In_One_Shop.Data.Repo.Interfaces
{
    public interface IStorageInterface
    {
        Task<ActionResult<IEnumerable<Storage>>> GetAllStorages();

        Task<ActionResult<Storage>> GetStorageById(int id);

        Task<ActionResult<Storage>> GetStorageByProductId(int productId);

        Task UpdateStorage(int id, Storage product);

        Task AddStorage(Storage product);

        Task<ActionResult<Storage>> DeleteStorage(int id);

        bool StorageExists(int id);
    }
}
