using All_In_One_Shop.Data.Repo.Interfaces;
using All_In_One_Shop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace All_In_One_Shop.Data.Repo
{
    public class StorageRepo : IStorageInterface
    {

        private readonly DataContext _context;

        public StorageRepo(DataContext context)
        {
            this._context = context;
        }

        public async Task AddStorage(Storage storage)
        {
            _context.Storages.Add(storage);

            await _context.SaveChangesAsync();
        }

        public async Task<ActionResult<Storage>> DeleteStorage(int id)
        {
            var storage = await _context.Storages.FindAsync(id);

            if (storage != null)
            {
                _context.Storages.Remove(storage);
                await _context.SaveChangesAsync();
            }

            return storage;
        }

        public async Task<ActionResult<IEnumerable<Storage>>> GetAllStorages()
        {
            return await _context.Storages.ToListAsync();
        }

        public async Task<ActionResult<Storage>> GetStorageById(int id)
        {
            var storage = await _context.Storages.FindAsync(id);

            return storage;
        }

        public bool StorageExists(int id)
        {
            return _context.Storages.Any(e => e.Id == id);
        }

        public async Task UpdateStorage(int id, Storage storage)
        {
            _context.Storages.Update(storage);

            await _context.SaveChangesAsync();
        }
    }
}
