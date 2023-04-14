using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using All_In_One_Shop.Data;
using All_In_One_Shop.Models;
using All_In_One_Shop.Data.Repo.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace All_In_One_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoragesController : ControllerBase
    {
        private readonly IStorageInterface _storageRepo;

        public StoragesController(IStorageInterface storageRepo)
        {
            this._storageRepo = storageRepo;
        }

        // GET: api/Storages
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Storage>>> GetStorages()
        {
            return await _storageRepo.GetAllStorages();
        }

        // GET: api/Storages/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Storage>> GetStorage(int id)
        {
            var storage = await _storageRepo.GetStorageById(id);

            if (storage == null)
            {
                return NotFound();
            }

            return storage;
        }
        
        [HttpGet("p{id}")]
        public async Task<ActionResult<Storage>> GetStoragebyProductId(int id)
        {
            var storage = await _storageRepo.GetStorageByProductId(id);

            if (storage == null)
            {
                return NotFound();
            }

            return storage;
        }

        // PUT: api/Storages/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutStorage(int id, Storage storage)
        {
            if (id != storage.Id)
            {
                return BadRequest();
            }

            try
            {

                await _storageRepo.UpdateStorage(id, storage);

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_storageRepo.StorageExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Storages
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Storage>> PostStorage(Storage storage)
        {

            await _storageRepo.AddStorage(storage);


            return CreatedAtAction("GetStorage", new { id = storage.Id }, storage);
        }

        // DELETE: api/Storages/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteStorage(int id)
        {
            var storage = await _storageRepo.DeleteStorage(id);

            if (storage == null)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
